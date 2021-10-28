import React, { useRef, useState } from "react";

type HTMLAttributesWithRef = React.HTMLAttributes<HTMLElement> & {
  ref?: (element: HTMLElement | null) => void;
};

interface GetPartProps {
  part: Intl.DateTimeFormatPart;
  index: number;
}

interface Props {
  value: Date;
  onChange?: (value: Date) => void;
  step?: number;
  startOfWeek?: number;
  locales?: string | string[];
  options?: Intl.DateTimeFormatOptions;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useDateTimePicker({
  value,
  onChange,
  step,
  startOfWeek = 0,
  locales,
  options,
}: Props) {
  const date = new Date(value);

  const [displayYear, setDisplayYear] = useState(date.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(date.getMonth());
  const [displayDate, setDisplayDate] = useState(date.getDate());

  console.log(displayYear, displayMonth, displayDate);

  const datess = getDatesInMonthGrid(displayYear, displayMonth, startOfWeek);
  console.log(datess);

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

  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const { focusNextPart, focusPrevPart } = usePartsFocus(
    parts,
    partEls,
    highlightedIndex
  );

  function getInputProps(): React.HTMLAttributes<HTMLElement> {
    // TODO: Maybe rename - can't be placed on an input
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

  // TODO: Each instance should have an id
  // Make sure all labeldbys point to correct ids
  // Sort iteme above or below spread depending on overwriting ability
  function getModalProps({ ...props } = {}): React.HTMLAttributes<HTMLElement> {
    return {
      id: "id-datepicker-1",
      role: "dialog",
      "aria-modal": true,
      "aria-labelledby": "id-dialog-label",
      ...props,
    };
  }

  function getPreviousYearButtonProps({
    ...props
  } = {}): React.ButtonHTMLAttributes<HTMLButtonElement> {
    return {
      type: "button",
      "aria-label": "previous year",
      ...props,
    };
  }

  function getPreviousMonthButtonProps({
    ...props
  } = {}): React.ButtonHTMLAttributes<HTMLButtonElement> {
    return {
      type: "button",
      "aria-label": "previous month",
      ...props,
    };
  }

  function getNextMonthButtonProps({
    ...props
  } = {}): React.ButtonHTMLAttributes<HTMLButtonElement> {
    return {
      type: "button",
      "aria-label": "next month",
      ...props,
    };
  }

  function getNextYearButtonProps({
    ...props
  } = {}): React.ButtonHTMLAttributes<HTMLButtonElement> {
    return {
      type: "button",
      "aria-label": "next year",
      ...props,
    };
  }

  function getTableProps({
    ...props
  } = {}): React.TableHTMLAttributes<HTMLTableElement> {
    return {
      id: "myDatepickerGrid",
      className: "dates",
      role: "grid",
      "aria-labelledby": "id-dialog-label",
      ...props,
    };
  }

  return {
    // Prop getter
    getInputProps,
    getPartProps,
    getModalProps,
    getPreviousYearButtonProps,
    getPreviousMonthButtonProps,
    getNextMonthButtonProps,
    getNextYearButtonProps,
    getTableProps,
    // Stuff
    parts,
    // Data
    highlightedIndex,
  };
}

function getDatesInMonthGrid(year: number, month: number, startOfWeek: number) {
  const firstDateInMonth = new Date(year, month, 1);
  const firstDateInMonthGrid = new Date(
    year,
    month,
    startOfWeek + 1 - firstDateInMonth.getDay()
  );

  const date = new Date(firstDateInMonthGrid);
  const datesInMonthGrid: Date[][] = [];

  // Always show 6 weeks to accomodate months stretching maximum months.
  for (let week = 0; week < 6; week++) {
    datesInMonthGrid[week] = [];
    for (let day = 0; day < 7; day++) {
      datesInMonthGrid[week][day] = new Date(date);
      date.setDate(date.getDate() + 1);
    }
  }

  return datesInMonthGrid;
}

function usePartsFocus(
  parts: Intl.DateTimeFormatPart[],
  partEls: React.MutableRefObject<HTMLElement[]>,
  highlightedIndex: number
) {
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

  return { focusNextPart, focusPrevPart };
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
