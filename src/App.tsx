import React, { useRef, useState } from "react";

export default function App(): JSX.Element {
  const [dt, setDt] = useState(new Date());
  const [dateTime, setDateTime] = useState("2021-01-01T01:00");

  return (
    <div className="flex flex-col">
      <input
        type="datetime-local"
        value={dateTime}
        onChange={(e) => {
          setDateTime(e.target.value);
        }}
      />
      <div tabIndex={0}>Hi</div>
      <Input value={dt} onChange={(date) => setDt(date)} />
    </div>
  );
}

interface InputProps {
  value: Date;
  onChange?: (value: Date) => void;
  step?: number;
  locales?: string | string[];
  options?: Intl.DateTimeFormatOptions;
}
function Input({
  value,
  onChange,
  step = 60,
  locales = [...navigator.languages],
  options,
}: InputProps) {
  const { getInputProps, getPartProps, parts, highlightedIndex } =
    useComposableDatepicker(value, onChange, step, locales, options);

  return (
    <div {...getInputProps()}>
      {parts.map((part, i) => {
        const isHighlighted = highlightedIndex === i;
        return (
          <span
            key={i}
            className={`${isHighlighted ? "bg-gray-200" : ""}`}
            {...getPartProps({
              part: part,
              index: i,
            })}
          >
            {part.value}
          </span>
        );
      })}
    </div>
  );
}

interface GetPartProps {
  part: Intl.DateTimeFormatPart;
  index: number;
}

type HTMLAttributesWithRef = React.HTMLAttributes<HTMLElement> & {
  ref?: (element: HTMLElement | null) => void;
};

function useComposableDatepicker(
  value: Date,
  onChange?: (value: Date) => void,
  step?: number,
  locales?: string | string[],
  options?: Intl.DateTimeFormatOptions
) {
  const date = new Date(value);

  // TODO: Show these depending on step value
  const formatterOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    ...options,
  };
  const formatter = new Intl.DateTimeFormat(locales, formatterOptions);
  const parts = formatter.formatToParts(date);
  const partEls = useRef<HTMLElement[]>([]);
  const focusablePartIndexes = parts
    .map((part, i) => (part.type !== "literal" ? i : null))
    .filter((part): part is number => part !== null);

  function focusNextPart() {
    const i = focusablePartIndexes.indexOf(highlightedIndex);
    const isLastIndex = i === focusablePartIndexes.length;

    if (!isLastIndex) {
      partEls.current[focusablePartIndexes[i + 1]].focus();
      return true;
    } else {
      return false;
    }
  }

  function focusPrevPart() {
    const i = focusablePartIndexes.indexOf(highlightedIndex);
    const isFirstIndex = i === 0;

    if (!isFirstIndex) {
      partEls.current[focusablePartIndexes[i - 1]].focus();
      return true;
    } else {
      return false;
    }
  }
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  function getInputProps(): React.HTMLAttributes<HTMLElement> {
    // TODO: Maybe rename - can't be place on an input
    return {
      tabIndex: -1,
      onBlur: () => setHighlightedIndex(-1),
    };
  }

  function getPartProps({ part, index }: GetPartProps): HTMLAttributesWithRef {
    if (part.type === "literal") return {};

    return {
      ref: (element) => {
        if (!element) return;
        partEls.current[index] = element;
      },
      tabIndex: 0,
      onFocus: () => setHighlightedIndex(index),
      onKeyDown: (e) => {
        switch (e.key) {
          case "ArrowRight": {
            e.preventDefault();
            focusNextPart();
            break;
          }
          case "ArrowLeft":
            e.preventDefault();
            focusPrevPart();
            break;
          case "ArrowUp": {
            e.preventDefault();
            const newDate = adjustDate(value, part.type, 1);
            onChange?.(newDate);
            break;
          }
          case "ArrowDown": {
            e.preventDefault();
            const newDate = adjustDate(value, part.type, -1);
            onChange?.(newDate);
            break;
          }
        }
      },
    };
  }

  return {
    // Prop getter
    getInputProps,
    getPartProps,
    // Stuff
    parts,
    // Data
    highlightedIndex,
  };
}

function adjustDate(
  date: Date,
  type: Intl.DateTimeFormatPartTypes | undefined,
  change: number
): Date {
  const newDate = new Date(date);
  switch (type) {
    case "day":
      newDate.setDate(date.getDate() + change);
      break;
    case "month":
      newDate.setMonth(date.getMonth() + change);
      break;
    case "year":
      newDate.setFullYear(date.getFullYear() + change);
      break;
    case "hour":
      newDate.setHours(date.getHours() + change);
      break;
    case "minute":
      newDate.setMinutes(date.getMinutes() + change);
      break;
    case "second":
      newDate.setSeconds(date.getSeconds() + change);
      break;
    case "dayPeriod":
      // Special case, just toggle
      newDate.setHours((date.getHours() + 12) % 24);
      break;
    case "weekday":
      newDate.setDate(date.getDate() + change);
      break;
    case "era":
      // TODO
      break;
    default:
      return date;
  }
  return newDate;
}
