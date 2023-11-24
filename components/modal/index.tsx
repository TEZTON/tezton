import * as Dialog from "@radix-ui/react-dialog";

interface ModalProps {
  /**
   * Class names to apply to the content container which wraps `children`.
   */
  className?: string;
  /**
   * Element (e.g. button) which when interacted with, will open the sidebar.
   */
  trigger?: JSX.Element;
  /**
   * Whether the sidebar is open or not - used to control the sidebar manually.
   */
  open?: boolean;
  /**
   * Whether the sidebar *should* be open or not.
   *
   * e.g. if a user clicks on the area outside of the modal, onOpenChange will be called
   * with `false`, but the modal won't actually close (since its open state is
   * controlled by `open`).
   */
  setOpen?: (open: boolean) => void;
  /**
   * Content to render inside the sidebar.
   */
  children: React.ReactNode;
}

export default function Modal({
  trigger,
  className,
  open,
  setOpen,
  children,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-default bg-opacity-50 backdrop-blur-[2px]" />
        <Dialog.Content
          className={`z-50 fixed top-1/2 left-1/2 min-h-[250px] w-full max-w-[450px] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-md border border-disabled bg-white shadow-2DP ${className}`}
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
