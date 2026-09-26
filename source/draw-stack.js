"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DrawStack {
    static getType(card) {
        if (card.isSpecial && card.color != "black" && card.value == 2)
            return "DRAW_TWO";
        if (card.isSpecial && card.color == "black" && card.value == 1)
            return "WILD_DRAW_FOUR";
        return null;
    }
    static getValue(type) {
        return type == "DRAW_TWO" ? 2 : 4;
    }
    static canStack(card, game) {
        const type = this.getType(card);
        return Boolean(game.pendingDraw && type);
    }
    static addCard(game, card) {
        const type = this.getType(card);
        if (!type)
            return;
        game.pendingDraw = (game.pendingDraw || 0) + this.getValue(type);
        game.drawStackType = type;
    }
    static clear(game) {
        game.pendingDraw = 0;
        game.drawStackType = null;
    }
}
exports.default = DrawStack;
