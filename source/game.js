"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deck_1 = __importDefault(require("./deck"));
const rules_1 = __importDefault(require("./rules"));
const draw_stack_1 = __importDefault(require("./draw-stack"));
const db_model_1 = require("../model/db-model");
class Game {
    constructor() {
        this.deck = new deck_1.default();
    }
    dealCards(game) {
        const cards = this.deck.createShuffledDeck();
        game.discardPile = [];
        draw_stack_1.default.clear(game);
        game.pendingHandSwapPlayerId = null;
        game.pendingColorPlayerId = null;
        if (typeof game.advancedMode != "boolean")
            game.advancedMode = false;
        for (const player of game.players) {
            player.cards = [];
            player.drawCard = 0;
            player.canEnd = false;
            for (let i = 0; i < 7; i++)
                player.cards.push(cards.pop());
        }
        const startingCardIndex = cards.findIndex(card => !card.isSpecial);
        game.currentCard = cards.splice(startingCardIndex, 1)[0];
        game.currentColor = game.currentCard.color;
        game.drawPile = cards;
    }
    drawFromPile(game) {
        if (!game.drawPile)
            game.drawPile = [];
        if (!game.discardPile)
            game.discardPile = [];
        if (!game.drawPile.length && game.discardPile.length) {
            game.drawPile = this.deck.shuffle(game.discardPile);
            game.discardPile = [];
        }
        return game.drawPile.length ? game.drawPile.pop() : null;
    }
    drawToCurrentPlayer(game, playerIndex, count) {
        let drawn = 0;
        for (let i = 0; i < count; i++) {
            const card = this.drawFromPile(game);
            if (!card)
                break;
            game.players[playerIndex].cards.push(card);
            drawn++;
        }
        return drawn;
    }
    hasReachedWinningScore(game) {
        const winningScore = Number(game.winningScore) >= 500 ? Number(game.winningScore) : 500;
        if (game.players[game.currentPlayerTurn].score < winningScore)
            return false;
        draw_stack_1.default.clear(game);
        game.pendingColorPlayerId = null;
        return true;
    }
    hasPlayableCard(game, playerIndex) {
        return game.players[playerIndex].cards.some(card => Boolean(new rules_1.default(game.currentCard, card, game.currentColor).getRule()));
    }
    passHands(game) {
        const hands = game.players.map(player => player.cards.map(card => card.toObject ? card.toObject() : Object.assign({}, card)));
        const playerCount = game.players.length;
        for (let index = 0; index < playerCount; index++) {
            const targetIndex = (index + (game.isReversed ? -1 : 1) + playerCount) % playerCount;
            game.players[targetIndex].cards = hands[index];
        }
        game.markModified("players");
    }
    createGame(gameId, players) {
        return __awaiter(this, void 0, void 0, function* () {
            const numberOfPlayers = players.length;
            if (numberOfPlayers < 2)
                throw new Error("can't start a game with less than 2 players");
            const game = yield db_model_1.gameModel.findById(gameId);
            this.dealCards(game);
            game.numberOfPlayers = numberOfPlayers;
            game.isReversed = false;
            game.gameStart = true;
            yield game.save();
            return game;
        });
    }
    calculateNextTurn(game) {
        game.players[game.currentPlayerTurn].drawCard = 0;
        game.players[game.currentPlayerTurn].canEnd = false;
        if (game.isReversed && game.currentPlayerTurn == 0)
            game.currentPlayerTurn = game.numberOfPlayers - 1;
        else {
            if (game.isReversed)
                game.currentPlayerTurn--;
            else
                game.currentPlayerTurn = (game.currentPlayerTurn + 1) % game.numberOfPlayers;
        }
        game.players[game.currentPlayerTurn].canEnd = false;
    }
    addCard(game, card) {
        game.players[game.currentPlayerTurn].cards.push(card);
    }
    removeCard(game, index) {
        game.players[game.currentPlayerTurn].cards.splice(index, 1);
    }
    /**
     * -1 => not your turn
     * 0 => false
     * 1 => true
     * 2 => +2
     * 4 => +4
     * 3 => choose color
     * 5 => skip
     * 6 => inverse
     * 7 => game end
     */
    play(gameId, playerIndex, cardIndex, card, playerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield db_model_1.gameModel.findById(gameId);
            if (!game || playerIndex < 0 || playerIndex >= game.players.length)
                return -1;
            if (game.pendingHandSwapPlayerId)
                return 0;
            if (game.currentPlayerTurn != playerIndex || game.players[game.currentPlayerTurn].playerId != playerId)
                return -1;
            const player = game.players[game.currentPlayerTurn];
            if (cardIndex < 0 || cardIndex >= player.cards.length)
                return 0;
            const playedCard = player.cards[cardIndex];
            const advancedZero = game.advancedMode && !playedCard.isSpecial && playedCard.value == 0;
            const advancedSeven = game.advancedMode && !playedCard.isSpecial && playedCard.value == 7;
            const hasPendingDraw = (game.pendingDraw || 0) > 0;
            if (hasPendingDraw) {
                if (!draw_stack_1.default.canStack(playedCard, game))
                    return 0;
            }
            else {
                const isWild = playedCard.isSpecial && playedCard.color == "black";
                if (player.drawCard > 0 && cardIndex != player.cards.length - 1 && !isWild)
                    return 0;
                const rule = new rules_1.default(game.currentCard, playedCard, game.currentColor);
                if (!rule.getRule())
                    return 0;
            }
            const drawType = draw_stack_1.default.getType(playedCard);
            const ruleNumber = drawType
                ? drawType == "DRAW_TWO" ? 2 : 6
                : playedCard.color == "black" ? 5
                    : playedCard.isSpecial
                        ? playedCard.value == 1 ? 3 : playedCard.value == 3 ? 4 : 0
                        : 1;
            player.drawCard = 0;
            game.players[game.currentPlayerTurn].canEnd = true;
            game.discardPile.push(game.currentCard);
            if (playedCard.color != "black")
                game.currentColor = playedCard.color;
            game.currentCard = playedCard;
            draw_stack_1.default.addCard(game, playedCard);
            this.removeCard(game, cardIndex);
            if (game.players[game.currentPlayerTurn].cards.length == 0) {
                draw_stack_1.default.clear(game);
                game.pendingColorPlayerId = null;
                game.pendingHandSwapPlayerId = null;
                yield game.save();
                return 7;
            }
            if (playedCard.color == "black" && game.players[game.currentPlayerTurn].cards.length > 0) {
                game.pendingColorPlayerId = playerId;
            }
            if (advancedZero)
                this.passHands(game);
            if (advancedSeven) {
                game.pendingHandSwapPlayerId = playerId;
                yield game.save();
                return 8;
            }
            if (ruleNumber == 1) {
                game.players[game.currentPlayerTurn].score += 20;
                if (this.hasReachedWinningScore(game)) {
                    yield game.save();
                    return 7;
                }
                this.calculateNextTurn(game);
                yield game.save();
                return 1;
            }
            else if (ruleNumber == 2) {
                game.players[game.currentPlayerTurn].score += 20;
                if (this.hasReachedWinningScore(game)) {
                    yield game.save();
                    return 7;
                }
                this.calculateNextTurn(game);
                yield game.save();
                return 2;
            }
            else if (ruleNumber == 3) {
                game.players[game.currentPlayerTurn].score += 20;
                if (this.hasReachedWinningScore(game)) {
                    yield game.save();
                    return 7;
                }
                // skip player
                this.calculateNextTurn(game);
                this.calculateNextTurn(game);
                yield game.save();
                return 5;
            }
            else if (ruleNumber == 4) {
                game.players[game.currentPlayerTurn].score += 20;
                if (this.hasReachedWinningScore(game)) {
                    yield game.save();
                    return 7;
                }
                // reverse 
                // reverse work as skip in case of 2 players 
                if (game.numberOfPlayers > 2) {
                    game.isReversed = !game.isReversed;
                    this.calculateNextTurn(game);
                }
                yield game.save();
                return 6;
            }
            else if (ruleNumber == 5) {
                game.players[game.currentPlayerTurn].score += 50;
                if (this.hasReachedWinningScore(game)) {
                    yield game.save();
                    return 7;
                }
                yield game.save();
                return 3;
            }
            else if (ruleNumber == 6) {
                game.players[game.currentPlayerTurn].score += 50;
                if (this.hasReachedWinningScore(game)) {
                    yield game.save();
                    return 7;
                }
                yield game.save();
                return 4;
            }
        });
    }
    changCurrentColor(gameId, color, playerIndex, playerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield db_model_1.gameModel.findById(gameId);
            if (game.currentPlayerTurn != playerIndex)
                return 0;
            if (game.players[game.currentPlayerTurn].playerId != playerId)
                return 0;
            if (game.pendingColorPlayerId == playerId && game.currentCard.color == "black" && ["red", "yellow", "blue", "green"].includes(color)) {
                game.currentColor = color;
                game.pendingColorPlayerId = null;
                this.calculateNextTurn(game);
                yield game.save();
                return game;
            }
            return 0;
        });
    }
    drawCard(gameId, playerIndex, playerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield db_model_1.gameModel.findById(gameId);
            if (!game)
                return 0;
            if (playerIndex < 0 || playerIndex >= game.players.length)
                return 0;
            const player = game.players[playerIndex];
            if (game.pendingHandSwapPlayerId)
                return 0;
            if (game.currentPlayerTurn != playerIndex || player.playerId != playerId)
                return 0;
            if ((game.pendingDraw || 0) > 0) {
                this.drawToCurrentPlayer(game, playerIndex, game.pendingDraw);
                draw_stack_1.default.clear(game);
                player.drawCard = 0;
                this.calculateNextTurn(game);
                yield game.save();
                return 2;
            }
            if (this.hasPlayableCard(game, playerIndex))
                return 0;
            let card = this.drawFromPile(game);
            if (!card) {
                this.calculateNextTurn(game);
                yield game.save();
                return 2;
            }
            do {
                player.cards.push(card);
                player.drawCard++;
                if (this.hasPlayableCard(game, playerIndex))
                    break;
                card = this.drawFromPile(game);
            } while (card);
            if (!card) {
                this.calculateNextTurn(game);
                yield game.save();
                return 2;
            }
            yield game.save();
            return 1;
        });
    }
    drawSingleCard(gameId, playerIndex, playerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield db_model_1.gameModel.findById(gameId);
            if (!game || playerIndex < 0 || playerIndex >= game.players.length)
                return 0;
            const player = game.players[playerIndex];
            if (game.pendingHandSwapPlayerId || (game.pendingDraw || 0) > 0)
                return 0;
            if (game.currentPlayerTurn != playerIndex || player.playerId != playerId)
                return 0;
            if (this.hasPlayableCard(game, playerIndex))
                return 0;
            const card = this.drawFromPile(game);
            if (!card) {
                this.calculateNextTurn(game);
                yield game.save();
                return 2;
            }
            player.cards.push(card);
            player.drawCard++;
            yield game.save();
            return 1;
        });
    }
    skipTurn(gameId, playerIndex, playerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield db_model_1.gameModel.findById(gameId);
            if (!game || playerIndex < 0 || playerIndex >= game.players.length)
                return 0;
            const player = game.players[playerIndex];
            if (game.pendingHandSwapPlayerId || game.pendingColorPlayerId || (game.pendingDraw || 0) > 0)
                return 0;
            if (game.currentPlayerTurn != playerIndex || player.playerId != playerId)
                return 0;
            if (!this.hasPlayableCard(game, playerIndex))
                return 0;
            this.drawToCurrentPlayer(game, playerIndex, 2);
            player.drawCard = 0;
            this.calculateNextTurn(game);
            yield game.save();
            return 1;
        });
    }
    swapHands(gameId, playerIndex, targetIndex, playerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield db_model_1.gameModel.findById(gameId);
            if (!game || !game.advancedMode || !Number.isInteger(playerIndex) || !Number.isInteger(targetIndex))
                return 0;
            if (playerIndex < 0 || playerIndex >= game.players.length || targetIndex < 0 || targetIndex >= game.players.length)
                return 0;
            if (playerIndex == targetIndex || game.currentPlayerTurn != playerIndex)
                return 0;
            if (game.players[playerIndex].playerId != playerId || game.pendingHandSwapPlayerId != playerId)
                return 0;
            const sourceCards = game.players[playerIndex].cards.map(card => card.toObject ? card.toObject() : Object.assign({}, card));
            const targetCards = game.players[targetIndex].cards.map(card => card.toObject ? card.toObject() : Object.assign({}, card));
            game.players[playerIndex].cards = targetCards;
            game.players[targetIndex].cards = sourceCards;
            game.pendingHandSwapPlayerId = null;
            game.markModified("players");
            if (!game.players.some(player => player.cards.length == 0))
                this.calculateNextTurn(game);
            yield game.save();
            return game;
        });
    }
    resetGame(game) {
        return __awaiter(this, void 0, void 0, function* () {
            const numberOfPlayers = game.players.length;
            if (numberOfPlayers < 2)
                throw new Error("can't start a game with less than 2 players");
            for (let i = 0; i < numberOfPlayers; i++) {
                game.players[i].score = 0;
            }
            this.dealCards(game);
            game.gameStart = true;
            game.numberOfPlayers = game.players.length;
            game.isReversed = false;
            game.currentPlayerTurn = 0;
            yield game.save();
            return game;
        });
    }
}
exports.default = Game;
