import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast border-2 border-black bg-white text-black font-mono shadow-lg",
          description: "text-gray-600 font-mono",
          actionButton: "bg-black text-white font-mono border-2 border-black",
          cancelButton: "bg-white text-black font-mono border-2 border-black",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };

