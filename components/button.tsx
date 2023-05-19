import { cls } from '../libs/client/utils';

interface ButtonProps {
  transparentBg?: boolean;
  large?: boolean;
  text: string;
  [key: string]: any;
}

export default function Button({
  transparentBg = false,
  large = false,
  onClick,
  text,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      onClick={onClick}
      className={cls(
        'w-full rounded-md border border-transparent px-4 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
        large ? 'py-3 text-base' : 'py-2 text-sm',
        transparentBg
          ? 'text-indigo-500 hover:border-indigo-600'
          : 'bg-indigo-500 text-white hover:bg-indigo-600',
      )}
    >
      {text}
    </button>
  );
}
