import React from 'react';
import ReactDOM from 'react-dom';
import BingoValues from './VladBingoValues';
import BingoBoard from './BingoBoard';

const Main = () => {
  const preload = new URLSearchParams(window.location.search);

  return <BingoBoard title="Vlad Bingo" preload={preload.get('board')} values={BingoValues} />;
};

ReactDOM.render(<Main />, document.body);
