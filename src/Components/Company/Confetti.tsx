import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";

const ConfettiPiece = styled("div")(({ theme }) => ({
  position: "absolute",
  width: "8px",
  height: "12px",
  backgroundColor: theme.palette.primary.main,
  top: "-10px",
  animation: "fall 3s linear infinite",
  opacity: 0.7,
  borderRadius: "2px",
}));

const ConfettiContainer = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  overflow: "hidden",
  zIndex: 9999,
  "@keyframes fall": {
    "0%": {
      transform: "translateY(0) rotate(0deg)",
      opacity: 1,
    },
    "100%": {
      transform: "translateY(100vh) rotate(720deg)",
      opacity: 0,
    },
  },
});

const Confetti = () => {
  const [pieces, setPieces] = useState<{ left: string; hue: number; rotate: number }[]>([]);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const generatedPieces = Array.from({ length: 100 }, () => ({
      left: `${Math.random() * 100}%`,
      hue: Math.floor(Math.random() * 360),
      rotate: Math.random() * 360,
    }));
    setPieces(generatedPieces);

    const stopGeneration = setTimeout(() => {
      setShowConfetti(false); // Stop showing new confetti after 15s
    }, 15000);

    const clearAll = setTimeout(() => {
      setPieces([]); // Clear confetti after all have finished falling
    }, 18000); // 15s + 3s animation time

    return () => {
      clearTimeout(stopGeneration);
      clearTimeout(clearAll);
    };
  }, []);

  if (!showConfetti && pieces.length === 0) {
    return null; // Completely remove container when done
  }

  return (
    <ConfettiContainer>
      {pieces.map((piece, index) => (
        <ConfettiPiece
          key={index}
          sx={{
            left: piece.left,
            backgroundColor: `hsl(${piece.hue}, 70%, 60%)`,
            transform: `rotate(${piece.rotate}deg)`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </ConfettiContainer>
  );
};

export default Confetti;
