'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

// ブロックの定義
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

const SHAPE_KEYS = Object.keys(SHAPES);

// ランダムにブロックを生成する関数
function getRandomShapes(count: number) {
  const shapes = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * SHAPE_KEYS.length);
    shapes.push(SHAPE_KEYS[randomIndex]);
  }
  return shapes;
}

export default function Home() {
  // 盤面の状態 (8x8)
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
  // エラー回避のため、最初は空配列にしておく
  const [holdingShapes, setHoldingShapes] = useState<string[]>([]);

  // 画面が表示された後に、ランダムなブロックをセットする
  useEffect(() => {
    setHoldingShapes(getRandomShapes(3));
  }, []);

  // ドラッグ操作の状態
  const [draggingBlock, setDraggingBlock] = useState<string | null>(null);
  const [draggingPosition, setDraggingPosition] = useState({ x: 0, y: 0 });

  // マウスが乗っているマスの位置
  const [hoveringCell, setHoveringCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // 1. マウスダウン：ドラッグ開始
  // (index引数は使わないので削除しました)
  const handleMouseDown = (e: React.MouseEvent, shapeKey: string) => {
    setDraggingBlock(shapeKey);
    setDraggingPosition({ x: e.clientX, y: e.clientY });
  };

  // 2. マウスムーブ：ドラッグ中の移動
  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingBlock) {
      setDraggingPosition({ x: e.clientX, y: e.clientY });
    }
  };

  // 3. マウスアップ：ドロップ判定・配置・消去・補充
  const handleMouseUp = () => {
    if (draggingBlock && hoveringCell) {
      const block = SHAPES[draggingBlock as keyof typeof SHAPES];
      const shapeData = block.shape;

      // ブロックの中心をマウス位置に合わせるための調整値
      const offsetY = Math.floor(shapeData.length / 2);
      const offsetX = Math.floor(shapeData[0].length / 2);

      let canPlace = true;

      // --- 配置可能かチェック ---
      for (let r = 0; r < shapeData.length; r++) {
        for (let c = 0; c < shapeData[r].length; c++) {
          if (shapeData[r][c] === 1) {
            const targetRow = hoveringCell.row + r - offsetY;
            const targetCol = hoveringCell.col + c - offsetX;

            // 盤面外チェック
            if (targetRow < 0 || targetRow >= 8 || targetCol < 0 || targetCol >= 8) {
              canPlace = false;
              break;
            }

            // すでにブロックがあるかチェック
            if (board[targetRow][targetCol] !== 0) {
              canPlace = false;
              break;
            }
          }
        }
      }

      // --- 配置実行 ---
      if (canPlace) {
        const newBoard = board.map((row) => [...row]);

        // ブロックを書き込む
        for (let r = 0; r < shapeData.length; r++) {
          for (let c = 0; c < shapeData[r].length; c++) {
            if (shapeData[r][c] === 1) {
              const targetRow = hoveringCell.row + r - offsetY;
              const targetCol = hoveringCell.col + c - offsetX;
              newBoard[targetRow][targetCol] = 1;
            }
          }
        }

        // --- ライン消去ロジック ---
        const rowsToClear: number[] = [];
        const colsToClear: number[] = [];

        // 横の列（行）をチェック
        for (let r = 0; r < 8; r++) {
          if (newBoard[r].every((cell) => cell !== 0)) {
            rowsToClear.push(r);
          }
        }

        // 縦の列（列）をチェック
        for (let c = 0; c < 8; c++) {
          const column = newBoard.map((row) => row[c]);
          if (column.every((cell) => cell !== 0)) {
            colsToClear.push(c);
          }
        }

        // 該当する行を消す
        rowsToClear.forEach((r) => {
          for (let c = 0; c < 8; c++) {
            newBoard[r][c] = 0;
          }
        });

        // 該当する列を消す
        colsToClear.forEach((c) => {
          for (let r = 0; r < 8; r++) {
            newBoard[r][c] = 0;
          }
        });

        // 盤面更新
        setBoard(newBoard);

        // --- 手持ちブロックの更新 ---
        const newHoldingShapes = [...holdingShapes];
        const indexToDelete = newHoldingShapes.indexOf(draggingBlock);

        if (indexToDelete !== -1) {
          newHoldingShapes.splice(indexToDelete, 1);
        }

        // 手持ちが空になったら補充
        if (newHoldingShapes.length === 0) {
          newHoldingShapes.push(...getRandomShapes(3));
        }

        setHoldingShapes(newHoldingShapes);
      }
    }

    // ドラッグ状態のリセット
    setDraggingBlock(null);
    setDraggingPosition({ x: 0, y: 0 });
  };

  return (
    <main className={styles.container} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      {/* ゲーム盤面 */}
      <div className={styles.board} onMouseLeave={() => setHoveringCell(null)}>
        {board.map((row, rowIndex) =>
          row.map((_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={styles.cell}
              onMouseEnter={() => setHoveringCell({ row: rowIndex, col: colIndex })}
              style={{
                backgroundColor: row[colIndex] !== 0 ? '#555' : '#ddd',
              }}
            />
          )),
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
              // handleMouseDown に index を渡さず、shapeKey だけ渡すように変更
              onMouseDown={(e) => handleMouseDown(e, shapeKey)}
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

      {/* ドラッグ中のブロック（浮遊表示） */}
      {draggingBlock && (
        <div
          className={styles.draggingBlock}
          style={{
            left: draggingPosition.x,
            top: draggingPosition.y,
          }}
        >
          {SHAPES[draggingBlock as keyof typeof SHAPES].shape.map((row, rowIndex) => (
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
          ))}
        </div>
      )}
    </main>
  );
}
