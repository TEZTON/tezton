import * as RadixPopover from "@radix-ui/react-popover";

interface PopoverProps {
  children: React.ReactNode;
  trigger: JSX.Element;
  align?: RadixPopover.PopoverContentProps["align"];
  /**
   * The className to apply to the popover content.
   */
  className?: string;

  /**
   * Whether the sidebar is open or not - used to control the sidebar manually.
   */
  open?: RadixPopover.PopoverProps["open"];

  /**
   * Whether the sidebar *should* be open or not.
   *
   * e.g. if a user clicks on the area outside of the modal, onOpenChange will be called
   * with `false`, but the sidebar won't actually close (since its open state is
   * controlled by `open`).
   */
  onOpenChange?: RadixPopover.PopoverProps["onOpenChange"];
  style?: React.CSSProperties;
}

export function Popover({
  children,
  trigger,
  align,
  className,
  open,
  onOpenChange,
  style,
}: PopoverProps) {
  return (
    <RadixPopover.Root open={open} onOpenChange={onOpenChange}>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          className={className}
          sideOffset={5}
          align={align}
          style={style}
        >
          {children}
          <RadixPopover.Arrow className="fill-white" />
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
}
