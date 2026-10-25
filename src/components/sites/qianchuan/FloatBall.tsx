import Image from "next/image";

/** 右下角浮动「智投星」入口球 */
export function FloatBall() {
  return (
    <div className="fixed bottom-24 right-4 z-40 flex h-[104px] w-16 flex-col items-center justify-center rounded-[32px] bg-white shadow-[0_8px_24px_rgba(29,33,41,0.12)]">
      <Image
        src="/sites/qianchuan/floatball.png"
        alt="智投星"
        width={40}
        height={40}
        className="h-10 w-10 object-contain"
      />
      <span className="mt-2 text-[13px] text-[#323335]">智投星</span>
    </div>
  );
}
