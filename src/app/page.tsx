'use client';

import { useState } from 'react';
import styles from './page.module.css';

const SHAPES = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: '#00f0f0',
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#f0f000',
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: '#a000f0',
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: '#f0a000',
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: '#0000f0',
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: '#00f000',
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: '#f00000',
  },
};

const SHAPE_KEYS = Object.keys(SHAPES);

export default function Home() {
  // ゲームの盤面の状態を管理します
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  return (
    <main className={styles.container}>
      {/* ゲーム盤面 */}
      <div className={styles.board}>
        {board.map((row, rowIndex) =>
          row.map((_, colIndex) => <div key={`${rowIndex}-${colIndex}`} className={styles.cell} />),
        )}
      </div>

      {/* --- ここから追加 --- */}
      {/* 手持ちのブロックを表示するエリア */}
      <div className={styles.holdingArea}>
        {/* holdingShapesの配列を元に、一つずつブロックを描画 */}
        {holdingShapes.map((shapeKey, index) => {
          const block = SHAPES[shapeKey as keyof typeof SHAPES];
          return (
            // ブロック全体
            <div key={index} className={styles.block}>
              {/* ブロックの形を描画 */}
              {block.shape.map((row, rowIndex) => (
                <div key={rowIndex} className={styles.blockRow}>
                  {row.map((cell, colIndex) => (
                    <div
                      key={colIndex}
                      className={styles.blockCell}
                      style={{
                        // cellが1の時だけ色をつけ、0の時は透明にする
                        backgroundColor: cell ? block.color : 'transparent',
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      {/* --- ここまで追加 --- */}
    </main>
  );
}
