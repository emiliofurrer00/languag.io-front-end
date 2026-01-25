export default function FlashCard() {
  return (
    <div className="bg-neo-magenta py-6 flex flex-col items-center gap-2 justify-between w-full h-80 lg:max-w-[500px] max-w-[600px] border-foreground border-3 shadow-[8px_8px_0_0_hsl(var(--foreground))] rounded-xl">
      <div className="bg-amber-50 w-fit py-1 px-2 rounded-lg text-xs border-2">Web development</div>
      <span className="font-bold text-3xl px-4 text-center">What does HTML stand for?</span>
      <div>Click to reveal the answer</div>
    </div>
  );
}
