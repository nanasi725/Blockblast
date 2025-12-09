'use client';

import { useState } from 'react';
import styles from './page.module.css';

const SHAPES = {
  I: { shape: [[1, 1, 1, 1]], color: '#00f0f0' },
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

export default function Home() {
  // 盤面の状態
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

  // 手持ちのブロック
  const [holdingShapes, setHoldingShapes] = useState(['I', 'O', 'T']);

  // ドラッグ中の状態管理
  const [draggingBlock, setDraggingBlock] = useState<string | null>(null);
  const [draggingPosition, setDraggingPosition] = useState({ x: 0, y: 0 });
  const [hoveringCell, setHoveringCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // マウスダウン：ドラッグ開始
  const handleMouseDown = (
    e: React.MouseEvent,
    shapeKey: string,
    index: number
  ) => {
    setDraggingBlock(shapeKey);
    setDraggingPosition({ x: e.clientX, y: e.clientY });
  };

  // マウスムーブ：ドラッグ中の移動
  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingBlock) {
      setDraggingPosition({ x: e.clientX, y: e.clientY });
    }
  };

  // マウスアップ：ドロップ判定と配置
  const handleMouseUp = () => {
    if (draggingBlock && hoveringCell) {
      const block = SHAPES[draggingBlock as keyof typeof SHAPES];
      const shapeData = block.shape;

      // ★ここが修正点：ブロックの中心をマウス位置に合わせるための調整値
      const offsetY = Math.floor(shapeData.length / 2);
      const offsetX = Math.floor(shapeData[0].length / 2);

      let canPlace = true;

      // 1. 置けるかどうかのチェック
      for (let r = 0; r < shapeData.length; r++) {
        for (let c = 0; c < shapeData[r].length; c++) {
          if (shapeData[r][c] === 1) {
            // 調整値(offset)を使って、実際に置く座標を計算
            const targetRow = hoveringCell.row + r - offsetY;
            const targetCol = hoveringCell.col + c - offsetX;

            // 盤面外チェック
            if (
              targetRow < 0 ||
              targetRow >= 8 ||
              targetCol < 0 ||
              targetCol >= 8
            ) {
              canPlace = false;
              break;
            }

            // 重なりチェック
            if (board[targetRow][targetCol] !== 0) {
              canPlace = false;
              break;
            }
          }
        }
      }

      // 2. 置ける場合の処理
      if (canPlace) {
        const newBoard = board.map((row) => [...row]);

        for (let r = 0; r < shapeData.length; r++) {
          for (let c = 0; c < shapeData[r].length; c++) {
            if (shapeData[r][c] === 1) {
              const targetRow = hoveringCell.row + r - offsetY;
              const targetCol = hoveringCell.col + c - offsetX;
              newBoard[targetRow][targetCol] = 1;
            }
          }
        }
        setBoard(newBoard);

        // 使ったブロックを手持ちから削除
        const newHoldingShapes = [...holdingShapes];
        const indexToDelete = newHoldingShapes.indexOf(draggingBlock);
        if (indexToDelete !== -1) {
          newHoldingShapes.splice(indexToDelete, 1);
        }
        setHoldingShapes(newHoldingShapes);
      }
    }

    // リセット
    setDraggingBlock(null);
    setDraggingPosition({ x: 0, y: 0 });
  };

  return (
    <main
      className={styles.container}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* ゲーム盤面 */}
      <div
        className={styles.board}
        onMouseLeave={() => setHoveringCell(null)}
      >
        {board.map((row, rowIndex) =>
          row.map((_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={styles.cell}
              onMouseEnter={() =>
                setHoveringCell({ row: rowIndex, col: colIndex })
              }
              style={{
                backgroundColor: row[colIndex] !== 0 ? '#555' : '#ddd',
              }}
            />
          ))
        )}
      </div>

      {/* 手持ちブロックエリア */}
      <div className={styles.holdingArea}>
        {holdingShapes.map((shapeKey, index) => {
          const block = SHAPES[shapeKey as keyof typeof SHAPES];
          return (
            <div
              key={index}
              className={styles.block}
              onMouseDown={(e) => handleMouseDown(e, shapeKey, index)}
            >
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

      {/* ドラッグ中のブロック表示 */}
      {draggingBlock && (
        <div
          className={styles.draggingBlock}
          style={{
            left: draggingPosition.x,
            top: draggingPosition.y,
          }}
        >
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
