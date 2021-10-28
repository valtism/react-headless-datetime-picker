import React from "react";
import { Point } from "@visx/point";

function localPointGeneric(node: Element, event: EventType) {
  if (!node || !event) return null;

  const coords = getXAndYFromEvent(event);

  // find top-most SVG
  const svg = isSVGElement(node) ? node.ownerSVGElement : node;
  const screenCTM = isSVGGraphicsElement(svg) ? svg.getScreenCTM() : null;

  if (isSVGSVGElement(svg) && screenCTM) {
    // debugger
    let point = svg.createSVGPoint();
    point.x = coords.x;
    point.y = coords.y;
    point = point.matrixTransform(screenCTM.inverse());

    return new Point({
      x: point.x,
      y: point.y,
    });
  }

  // fall back to bounding box
  const rect = node.getBoundingClientRect();

  return new Point({
    x: coords.x - rect.left - node.clientLeft,
    y: coords.y - rect.top - node.clientTop,
  });
}

export type EventType =
  | MouseEvent
  | TouchEvent
  | FocusEvent
  | React.MouseEvent
  | React.TouchEvent
  | React.FocusEvent;

export function isElement(elem?: Element | EventType): elem is Element {
  return !!elem && elem instanceof Element;
}

// functional definition of isSVGElement. Note that SVGSVGElements are HTMLElements
export function isSVGElement(elem?: Element): elem is SVGElement {
  return !!elem && (elem instanceof SVGElement || "ownerSVGElement" in elem);
}

// functional definition of SVGGElement
export function isSVGSVGElement(elem?: Element | null): elem is SVGSVGElement {
  return !!elem && "createSVGPoint" in elem;
}

export function isSVGGraphicsElement(
  elem?: Element | null
): elem is SVGGraphicsElement {
  return !!elem && "getScreenCTM" in elem;
}

// functional definition of TouchEvent
export function isTouchEvent(
  event?: EventType
): event is TouchEvent | React.TouchEvent {
  return !!event && "changedTouches" in event;
}

// functional definition of MouseEvent
export function isMouseEvent(
  event?: EventType
): event is MouseEvent | React.MouseEvent {
  return !!event && "clientX" in event;
}

// functional definition of event
export function isEvent(event?: EventType | Element): event is EventType {
  return (
    !!event &&
    (event instanceof Event ||
      ("nativeEvent" in event && event.nativeEvent instanceof Event))
  );
}

const DEFAULT_POINT = { x: 0, y: 0 };

function getXAndYFromEvent(event?: EventType) {
  if (!event) return { ...DEFAULT_POINT };

  if (isTouchEvent(event)) {
    return event.changedTouches.length > 0
      ? {
          x: event.changedTouches[0].clientX,
          y: event.changedTouches[0].clientY,
        }
      : { ...DEFAULT_POINT };
  }

  if (isMouseEvent(event)) {
    return {
      x: event.clientX,
      y: event.clientY,
    };
  }

  // for focus events try to extract the center position of the target element
  const target = event?.target;
  const boundingClientRect =
    target && "getBoundingClientRect" in target
      ? target.getBoundingClientRect()
      : null;

  if (!boundingClientRect) return { ...DEFAULT_POINT };

  return {
    x: boundingClientRect.x + boundingClientRect.width / 2,
    y: boundingClientRect.y + boundingClientRect.height / 2,
  };
}

export default function localPoint(
  nodeOrEvent: Element | EventType,
  maybeEvent?: EventType
) {
  // localPoint(node, event)
  if (isElement(nodeOrEvent) && maybeEvent) {
    return localPointGeneric(nodeOrEvent, maybeEvent);
  }
  // localPoint(event)
  if (isEvent(nodeOrEvent)) {
    const event = nodeOrEvent;
    const node = event.target as Element;
    if (node) return localPointGeneric(node, event);
  }
  return null;
}
