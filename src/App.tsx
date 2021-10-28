// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local
// https://www.w3.org/TR/wai-aria-practices-1.2/examples/dialog-modal/datepicker-dialog.html

import React, { useRef, useState } from "react";
import { useDateTimePicker } from "./useDateTimePicker";

export default function App(): JSX.Element {
  const [dt, setDt] = useState(new Date());
  const [dateTime, setDateTime] = useState(new Date().toISOString());

  return (
    <div className="flex flex-col">
      <input
        type="datetime-local"
        value={dateTime}
        onChange={(e) => {
          // console.log(e.target.value);
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
  const {
    getInputProps,
    getPartProps,
    getModalProps,
    getPreviousYearButtonProps,
    getPreviousMonthButtonProps,
    getNextMonthButtonProps,
    getNextYearButtonProps,
    parts,
    highlightedIndex,
  } = useDateTimePicker({ value, onChange, step, locales, options });

  return (
    <div className="relative">
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
      <div className="p-4 bg-white">
        <div {...getModalProps()}>
          <div className="flex items-center">
            <button {...getPreviousYearButtonProps()}>
              <span>{"<<-"}</span>
            </button>
            <button {...getPreviousMonthButtonProps()}>
              <span>{"<-"}</span>
            </button>
            <button {...getNextMonthButtonProps()}>
              <span>{"->"}</span>
            </button>
            <button
              {...getNextYearButtonProps({ className: "focus:ring" })}
              className="focus:ring"
            >
              <span>{"->>"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// CanFocusExtendedRange prop

/**
 * modal
 * prev year
 * prev month
 * next month
 * next year
 * table
 * day
 * - date
 * - inSelectedMonth?
 * - isSelected
 * - isHighlighted? or just focus state?
 * cancel
 * ok
 * message
 */
function Calendar() {
  return (
    <div
      id="id-datepicker-1"
      className="bg-white"
      role="dialog"
      aria-modal="true"
      aria-labelledby="id-dialog-label"
    >
      <div className="header">
        <button type="button" className="prevYear" aria-label="previous year">
          <span className="fas fa-angle-double-left fa-lg">{"<<"}</span>
        </button>
        <button type="button" className="prevMonth" aria-label="previous month">
          <span className="fas fa-angle-left fa-lg">{" <"}</span>
        </button>
        <h2 id="id-dialog-label" className="monthYear" aria-live="polite">
          Month Year
        </h2>
        <button type="button" className="nextMonth" aria-label="next month">
          <span className="fas fa-angle-right fa-lg"></span>
        </button>
        <button type="button" className="nextYear" aria-label="next year">
          <span className="fas fa-angle-double-right fa-lg"></span>
        </button>
      </div>
      <table
        id="myDatepickerGrid"
        className="dates"
        role="grid"
        aria-labelledby="id-dialog-label"
      >
        <thead>
          <tr>
            <th scope="col" abbr="Sunday">
              Su
            </th>
            <th scope="col" abbr="Monday">
              Mo
            </th>
            <th scope="col" abbr="Tuesday">
              Tu
            </th>
            <th scope="col" abbr="Wednesday">
              We
            </th>
            <th scope="col" abbr="Thursday">
              Th
            </th>
            <th scope="col" abbr="Friday">
              Fr
            </th>
            <th scope="col" abbr="Saturday">
              Sa
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="dateCell">
              <button
                type="button"
                className="dateButton disabled"
                tabIndex={-1}
              >
                25
              </button>
            </td>
            <td className="dateCell">
              <button
                type="button"
                className="dateButton disabled"
                tabIndex={-1}
              >
                26
              </button>
            </td>
            <td className="dateCell">
              <button
                type="button"
                className="dateButton disabled"
                tabIndex={-1}
              >
                27
              </button>
            </td>
            <td className="dateCell">
              <button
                type="button"
                className="dateButton disabled"
                tabIndex={-1}
              >
                28
              </button>
            </td>
            <td className="dateCell">
              <button
                type="button"
                className="dateButton disabled"
                tabIndex={-1}
              >
                29
              </button>
            </td>
            <td className="dateCell">
              <button
                type="button"
                className="dateButton disabled"
                tabIndex={-1}
              >
                30
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                1
              </button>
            </td>
          </tr>
          <tr>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                2
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                3
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                4
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                5
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                6
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                7
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                8
              </button>
            </td>
          </tr>
          <tr>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                9
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                10
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                11
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                12
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                13
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton">
                14
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                15
              </button>
            </td>
          </tr>
          <tr>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                16
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                17
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                18
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                19
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                20
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                21
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                22
              </button>
            </td>
          </tr>
          <tr>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                23
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                24
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                25
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                26
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                27
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                28
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                29
              </button>
            </td>
          </tr>
          <tr>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                30
              </button>
            </td>
            <td className="dateCell">
              <button type="button" className="dateButton" tabIndex={-1}>
                31
              </button>
            </td>
            <td className="dateCell">
              <button
                type="button"
                className="dateButton disabled"
                tabIndex={-1}
              >
                1
              </button>
            </td>
            <td className="dateCell">
              <button
                type="button"
                className="dateButton disabled"
                tabIndex={-1}
              >
                2
              </button>
            </td>
            <td className="dateCell">
              <button
                type="button"
                className="dateButton disabled"
                tabIndex={-1}
              >
                3
              </button>
            </td>
            <td className="dateCell">
              <button
                type="button"
                className="dateButton disabled"
                tabIndex={-1}
              >
                4
              </button>
            </td>
            <td className="dateCell">
              <button
                type="button"
                className="dateButton disabled"
                tabIndex={-1}
              >
                5
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="dialogButtonGroup">
        <button type="button" className="dialogButton" value="cancel">
          Cancel
        </button>
        <button type="button" className="dialogButton" value="ok">
          OK
        </button>
      </div>
      <div className="message" aria-live="polite">
        Test
      </div>
    </div>
  );
}
