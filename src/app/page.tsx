'use client';

import { useState } from 'react';
import styles from './page.module.css';

// (SHAPES, SHAPE_KEYS の定義は変更なし)
const SHAPES = {
  I: { shape: [[1, 1, 1, 1]], color: '#00f0f0' },
  O: { shape: [[1, 1], [1, 1]], color: '#f0f000' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#a000f0' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#f0a000' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#0000f0' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#00f000' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#f00000' },
};
const SHAPE_KEYS = Object.keys(SHAPES);

export default function Home() {
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

  const [holdingShapes, setHoldingShapes] = useState(['I', 'O', 'T']);

  // 1. 掴んでいるブロックの状態 (何を掴んでいるか？)
  const [draggingBlock, setDraggingBlock] = useState<string | null>(null);

  // 2. 掴んでいるブロックの位置 (どこに表示するか？)
  const [draggingPosition, setDraggingPosition] = useState({ x: 0, y: 0 });

  // 3. マウスのボタンが押された時（ブロックを掴んだ時）の処理
  const handleMouseDown = (
    e: React.MouseEvent,
    shapeKey: string,
    index: number
  ) => {
    // どのブロックを掴んだか、名前を記憶する
    setDraggingBlock(shapeKey);
    // マウスの初期位置を記憶する
    setDraggingPosition({ x: e.clientX, y: e.clientY });
  };

  // 4. マウスが動いた時（ブロックを運んでいる時）の処理
  const handleMouseMove = (e: React.MouseEvent) => {
    // もし何かを掴んでいる最中 (draggingBlockがnullじゃない) なら...
    if (draggingBlock) {
      // マウスの現在位置を随時更新する
      setDraggingPosition({ x: e.clientX, y: e.clientY });
    }
  };

  // 5. マウスのボタンが離された時（ブロックを離した時）の処理
  const handleMouseUp = () => {
    // 掴んでいるブロックの情報をリセットする
    setDraggingBlock(null);
  };

  return (
    <main
      className={styles.container}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* ゲーム盤面 */}
      <div className={styles.board}>
        {board.map((row, rowIndex) =>
          row.map((_, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className={styles.cell} />
          ))
        )}
      </div>

      {/* 手持ちのブロックを表示するエリア */}
      <div className={styles.holdingArea}>
        {holdingShapes.map((shapeKey, index) => {
          const block = SHAPES[shapeKey as keyof typeof SHAPES];
          return (
            // --- ▼▼▼ onMouseDownイベントをここに追加 ▼▼▼ ---
            <div
              key={index}
              className={styles.block}
              onMouseDown={(e) => handleMouseDown(e, shapeKey, index)} // 掴む処理
            >
              {/* ブロックの形を描画 (ここは変更なし) */}
              {block.shape.map((row, rowIndex) => (
                <div key={rowIndex} className={styles.blockRow}>
                  {row.map((cell, colIndex) => (
                    <div
                      key={colIndex}
                      className={styles.blockCell}
                      style={{
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


      {/* 6. 掴んでいる最中のブロックを、マウスに追従させて表示する */}
      {draggingBlock && (
        <div
          className={styles.draggingBlock}
          style={{
            left: draggingPosition.x, 
            top: draggingPosition.y, 
          }}
        >
          {/* 掴んでいるブロックの形を描画 */}
          {SHAPES[draggingBlock as keyof typeof SHAPES].shape.map(
            (row, rowIndex) => (
              <div key={rowIndex} className={styles.blockRow}>
                {row.map((cell, colIndex) => (
                  <div
                    key={colIndex}
                    className={styles.blockCell}
                    style={{
                      backgroundColor: cell
                        ? SHAPES[draggingBlock as keyof typeof SHAPES].color
                        : 'transparent',
                    }}
                  />
                ))}
              </div>
            )
          )}
        </div>
      )}
    </main>
  );
}