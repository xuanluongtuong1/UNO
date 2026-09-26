import Card from './card';

export type DrawStackType = "DRAW_TWO" | "WILD_DRAW_FOUR";

class DrawStack {
  static getType(card: Card): DrawStackType {
    if (card.isSpecial && card.color != "black" && card.value == 2) return "DRAW_TWO";
    if (card.isSpecial && card.color == "black" && card.value == 1) return "WILD_DRAW_FOUR";
    return null;
  }

  static getValue(type: DrawStackType): number {
    return type == "DRAW_TWO" ? 2 : 4;
  }

  static canStack(card: Card, game): boolean {
    const type = this.getType(card);
    return Boolean(game.pendingDraw && type);
  }

  static addCard(game, card: Card): void {
    const type = this.getType(card);
    if (!type) return;
    game.pendingDraw = (game.pendingDraw || 0) + this.getValue(type);
    game.drawStackType = type;
  }

  static clear(game): void {
    game.pendingDraw = 0;
    game.drawStackType = null;
  }
}

export default DrawStack;