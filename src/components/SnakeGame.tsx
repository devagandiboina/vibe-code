import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Direction, Point } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 120;

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (direction) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setIsGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00ffff' : '#ff00ff';
      
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );

      if (isHead && Math.random() > 0.95) {
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(
          segment.x * cellSize - 2,
          segment.y * cellSize + 1,
          cellSize + 4,
          2
        );
      }
    });

    ctx.fillStyle = '#ffff00';
    const flicker = Math.random() > 0.9 ? 2 : 0;
    ctx.fillRect(
      food.x * cellSize + 4 + flicker,
      food.y * cellSize + 4 - flicker,
      cellSize - 8,
      cellSize - 8
    );

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-8 screen-tear">
      <div className="flex justify-between w-full max-w-[400px] items-end border-b-2 border-glitch-cyan pb-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-pixel text-glitch-magenta">DATA_HARVESTED</span>
          <span className="text-2xl font-pixel text-glitch-cyan leading-none">
            {score.toString().padStart(6, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase font-pixel text-glitch-magenta">CORE_STATE</span>
          <span className={`text-xs font-pixel uppercase ${isPaused ? 'text-glitch-yellow' : 'text-glitch-cyan'}`}>
            {isGameOver ? 'HALTED' : isPaused ? 'STALLED' : 'EXECUTING'}
          </span>
        </div>
      </div>

      <div className="relative group brutal-border">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="relative bg-void cursor-none"
        />
        
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-void/90 backdrop-blur-sm"
            >
              <div className="text-center p-8 border-4 border-glitch-magenta bg-void">
                {isGameOver ? (
                  <>
                    <h2 className="text-3xl font-pixel text-glitch-magenta mb-4 glitch-text" data-text="SYSTEM_FAILURE">SYSTEM_FAILURE</h2>
                    <p className="text-glitch-cyan mb-8 font-terminal text-xl uppercase tracking-widest">LOG_SCORE: {score}</p>
                    <button
                      onClick={resetGame}
                      className="brutal-btn"
                    >
                      REBOOT_CORE
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl font-pixel text-glitch-cyan mb-8 glitch-text" data-text="INPUT_WAIT">INPUT_WAIT</h2>
                    <button
                      onClick={() => setIsPaused(false)}
                      className="brutal-btn"
                    >
                      RESUME_STREAM
                    </button>
                    <p className="mt-6 text-[10px] text-glitch-magenta font-pixel uppercase">PRESS_SPACE_TO_TOGGLE</p>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-6 text-[10px] text-glitch-cyan/50 font-pixel uppercase">
        <span>[DIR_KEYS] MOVE</span>
        <span>[SPACE] INTERRUPT</span>
      </div>
    </div>
  );
};
