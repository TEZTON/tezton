import Image from "next/image";

export const CardSumary = ({ onPress }: any) => {
  return (
    <div
      className="min-w-[300px] border border-default dark:border-defaultdark p-4 flex flex-col rounded-lg bg-[#F8F9FF]"
      onClick={onPress}
    >
      <span className="text-lg">Titulo</span>
      <p className="text-sm">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Id quidem
        veritatis impedit sit quisquam odit qui ducimus, nihil modi soluta enim
        a, eaque aut in asperiores excepturi numquam officia. Sint!
      </p>
      <div className="w-full flex justify-end">
        <Image
          alt="Image"
          src="/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.jpeg"
          className="max-w-[30px] max-h-[30px] rounded-full overflow-hidden"
          width={30}
          height={30}
        />
      </div>
    </div>
  );
};
