import { ButtonOrange } from "@/ui/button";

export default function LoseModal({
  isOpen,  
  onRestart
}: {
  isOpen: boolean;  
  onRestart: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 ">
      <div className="pointer-events-auto bg-teal-700 text-white rounded-xl shadow-lg px-6 py-4 flex flex-col gap-4 mx-3 sm:mx-5">

        {/* base warp */}
        <div className="flex flex-col  text-center">
          <span className="font-bold text-2xl">Увы ! Вы проиграли !</span>
        </div>

        {/* buttons */}
        <div className="flex gap-5 justify-center">        

          <ButtonOrange
            onClick={onRestart}
          >
            Заново
          </ButtonOrange>
        </div>
      </div>
    </div>
  );
}