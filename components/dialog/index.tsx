import * as DialogRadix from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

export const Dialog = ({
  title,
  Trigger,
  Content,
}: any) => {
  return (
    <DialogRadix.Root>
      <DialogRadix.Trigger asChild>{Trigger}</DialogRadix.Trigger>
      <DialogRadix.Portal>
        <DialogRadix.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
        <DialogRadix.Content className="bg-white border border-default dark:border-defaultdark data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-foreground p-[25px] focus:outline-none">
          <DialogRadix.Title className="m-0 text-[17px] font-medium">
            {title}
          </DialogRadix.Title>
          <DialogRadix.Description className="mt-[10px] mb-5 text-[15px] leading-normal">
            {/* {description} */}
          </DialogRadix.Description>
          <Content />
          <DialogRadix.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <XIcon />
            </button>
          </DialogRadix.Close>
        </DialogRadix.Content>
      </DialogRadix.Portal>
    </DialogRadix.Root>
  );
};
