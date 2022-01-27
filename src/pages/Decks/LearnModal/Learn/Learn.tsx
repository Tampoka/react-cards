import s from './Learn.module.scss'
import {CardType} from '../../../../api/cards-api';

const grades = ['1', '2', '3', '4', '5']

const Learn = () => {
    const getCard = (cards: CardType[]) => {
        const sum = cards.reduce((acc, card) => acc + (6 - card.grade) * (6 - card.grade), 0)
        const random = Math.random() * sum
        const result = cards.reduce((acc: { sum: number, id: number }, card, i) => {
            const newSum = acc.sum + (6 - card.grade) * (6 - card.grade)
            return {sum: newSum, id: newSum < random ? i : acc.id}
        }, {sum: 0, id: -1})

        return cards[result.id + 1]
    }
    return (
        <div className={s.learnContainer}>

        </div>
    );
};

export default Learn;
