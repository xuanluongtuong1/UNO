import Card from './card';
class Deck {
  createShuffledDeck(): Card[] {
    const cards: Card[] = [];
    const colors = ["red", "yellow", "blue", "green"];

    for (const color of colors) {
      cards.push(new Card(0, color, false));
      for (let value = 1; value <= 9; value++) {
        cards.push(new Card(value, color, false));
        cards.push(new Card(value, color, false));
      }
      for (let value = 1; value <= 3; value++) {
        cards.push(new Card(value, color, true));
        cards.push(new Card(value, color, true));
      }
    }

    for (let i = 0; i < 4; i++) {
      cards.push(new Card(1, "black", true));
      cards.push(new Card(2, "black", true));
    }

    return this.shuffle(cards);
  }

  shuffle(cards: Card[]): Card[] {
    const shuffled = cards.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }
    return shuffled;
  }
}
export default Deck;