"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = __importDefault(require("./card"));
class Deck {
    createShuffledDeck() {
        const cards = [];
        const colors = ["red", "yellow", "blue", "green"];
        for (const color of colors) {
            cards.push(new card_1.default(0, color, false));
            for (let value = 1; value <= 9; value++) {
                cards.push(new card_1.default(value, color, false));
                cards.push(new card_1.default(value, color, false));
            }
            for (let value = 1; value <= 3; value++) {
                cards.push(new card_1.default(value, color, true));
                cards.push(new card_1.default(value, color, true));
            }
        }
        for (let i = 0; i < 4; i++) {
            cards.push(new card_1.default(1, "black", true));
            cards.push(new card_1.default(2, "black", true));
        }
        return this.shuffle(cards);
    }
    shuffle(cards) {
        const shuffled = cards.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
        }
        return shuffled;
    }
}
exports.default = Deck;
