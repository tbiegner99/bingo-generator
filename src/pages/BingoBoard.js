import React, { useState, useEffect } from 'react';
import combineClasses from 'classnames';
import styles from './board.css';

const shuffle = (values) => {
  const withRand = values.map((value, arrIndex) => ({
    value,
    index: Math.random(),
    originalIndex: arrIndex
  }));
  withRand.sort((val1, val2) => val1.index - val2.index);
  return withRand;
};

const renderHeader = () => {
  const headers = ['B', 'I', 'N', 'G', 'O'];
  return headers.map((header) => <div className={styles.header}>{header}</div>);
};
const toggle = (board, index, setSelected) => {
  const selected = getSelected(board, index);
  selected[index] = !selected[index];
  sessionStorage.setItem(board, JSON.stringify(selected));
  setSelected(selected);
};

const renderMiddleSquare = (board, val, index, isSelected, setSelected) =>
  renderSquare(board, '_______', index, isSelected, setSelected);
const renderSquare = (board, value, index, isSelected, setSelected) => (
  <div
    onClick={() => toggle(board, index, setSelected)}
    className={combineClasses(styles.square, { [styles.selected]: isSelected })}
  >
    {value}
  </div>
);
const renderSquares = (board, values, selected, setSelected) => {
  const valsToRender = values.slice(0, 25);

  return valsToRender.map((val, index) => {
    const isSelected = Boolean(selected[index]);
    return index === 12
      ? renderMiddleSquare(board, val, index, isSelected, setSelected)
      : renderSquare(board, val, index, isSelected, setSelected);
  });
};
const loadBoard = (str, values) => {
  const ret = [];
  for (let i = 0; i < str.length; i += 2) {
    const digit = str.slice(i, i + 2);
    const index = Number.parseInt(digit, 16);
    ret.push(values[index]);
  }
  return ret;
};
const getSelected = (board) => {
  const selected = sessionStorage.getItem(board);
  if (!selected) {
    const arr = new Array(25);
    sessionStorage.setItem(board, JSON.stringify(arr));
    return arr;
  }
  return JSON.parse(selected);
};
const BingoBoard = (props) => {
  const { title, values, preload } = props;

  if (!preload) {
    useEffect(() => {
      const shuffleVals = shuffle(values).slice(0, 25);
      const toByte = (num) => {
        const digit = num.toString(16);
        if (digit.length < 2) {
          return `0${digit}`;
        }
        return digit;
      };
      const str = shuffleVals.reduce((agg, item) => agg + toByte(item.originalIndex), '');
      window.location.href = `?board=${str}`;
    });
    return null;
  }
  const randomValues = loadBoard(preload, values);
  const [selected, setSelected] = useState(getSelected(preload));
  return (
    <main className={styles.mainPage}>
      <h1 className={styles.title}>{title}</h1>
      <h5 className={styles.title}>Write your own word for middle square</h5>
      <div className={combineClasses(styles.title, styles.generateBoard)}>
        <a href="/bingo">Generate new board</a>
      </div>
      <div className={styles.board}>
        {renderHeader()}
        {renderSquares(preload, randomValues, selected, setSelected)}
      </div>
    </main>
  );
};

export default BingoBoard;
