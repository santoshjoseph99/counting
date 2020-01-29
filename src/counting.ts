import { BlackjackDeck, Card, Rank, Suit } from 'deckjs';
import Hand from './hand';
import { max, min } from 'lodash';

export type CardCallback = (player: number, card: Card) => void;
export {
  Card,
  Rank,
  Suit
}

export default class BlackjackCounter {
  private deck: BlackjackDeck;
  private cb: CardCallback;
  private numOfDecks: number;
  private numOfPlayers: number;
  private countNum: number;

  constructor(cb: CardCallback, numOfDecks: number = 6, numOfPlayers: number = 1) {
    // TODO: strategyType
    this.numOfDecks = numOfDecks;
    this.numOfPlayers = numOfPlayers;
    this.cb = cb;
    this.deck = new BlackjackDeck(numOfDecks);
    this.countNum = 0;
  }

  get count() {
    return this.countNum;
  }

  public shuffle(): void {
    this.deck.shuffle();
  }

  public startGame(): void {
    this.countNum = 0;
    this.startHand();
  }

  public startHand(): void {
    const d1 = this.deck.getCard();
    const d2 = this.deck.getCard();
    const p1 = this.deck.getCard();
    const p2 = this.deck.getCard();
    this.cb(1, p1);
    this.countNum += this.getCount(p1);
    this.cb(0, d1);
    this.countNum += this.getCount(d1);
    this.cb(1, p2);
    this.countNum += this.getCount(p2);
    this.cb(0, d2);
  }

  public endGame(): void {
  }

  public getCard(): Card {
    const c = this.deck.getCard();
    this.countNum += this.getCount(c);
    return c;
  }

  public getCountFromCards(cards: Card[]): number {
    return cards.map(this.getCount).reduce((a: number, b: number) => a + b, 0);
  }

  public getBlackjackScore(cards: Card[]): number[] {
    const results = Hand.getHandValues(cards);
    return results; 
  }

  public isSoftSeventeen(cards: Card[]): boolean {
    return cards[0].rank === Rank.Ace && cards[1].rank === Rank.Six ||
      cards[1].rank === Rank.Ace && cards[0].rank === Rank.Six;
  }

  public getHighestNonBustScore(scores: number[]): number {
    return max(scores.filter(x => x < 22)) || 0;
  }

  public getLowestBustScore(scores: number[]): number {
    return min(scores.filter(x => x > 21)) || 0;
  }

  private getCount(card: Card): number {
    if (card.rank === Rank.Ace ||
      card.rank === Rank.Ten ||
      card.rank === Rank.Jack ||
      card.rank === Rank.Queen ||
      card.rank === Rank.King) {
      return -1;
    } else if (card.rank === Rank.Two ||
      card.rank === Rank.Three ||
      card.rank === Rank.Four ||
      card.rank === Rank.Five ||
      card.rank === Rank.Six) {
      return 1;
    } else {
      return 0;
    }
  }
}

/*
 UI code will call create the class with the number of decks, strategyForCounting, players#, timeout, showcount
   then will call start() with call backs
   callback -> player#, cards
   getCard() will return a card (when player hits)
   +, - for keeping count or -2, -1, 0, +1, +2 for buttons and have a highlight over each card
   OR
   +, - buttons and then prompt the player for action and then +/-. then dealer happens every 1 second


*/