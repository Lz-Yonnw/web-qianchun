import { FloatBall } from "@/components/sites/qianchuan/FloatBall";
import { AuthFailureGuard } from "@/components/sites/qianchuan/AuthFailureGuard";

/** 平台内页布局：顶部导航在各页面自行渲染（需传入 active），此处提供页面底色与浮动球。 */
export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f2f3f5] text-[#1d2129]">
      <AuthFailureGuard>
        {children}
        <FloatBall />
      </AuthFailureGuard>
    </div>
  );
}
