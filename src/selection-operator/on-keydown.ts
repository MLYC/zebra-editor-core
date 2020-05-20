import Character from "../components/character";
import Collection from "../components/collection";
import Paragraph from "../components/paragraph";
import CharacterDecorate from "../decorate/character";
import ComponentType from "../const/component-type";
import getSelection from "./get-selection";
import { getComponentById } from "../components/util";

const onKeyDown = (event: KeyboardEvent) => {
  let selection = getSelection();
  let component = getComponentById(selection.range[0].componentId);
  let start = selection.range[0].offset;
  let end = selection.range[1].offset;
  if (start > end) {
    [start, end] = [end, start];
  }
  if (component.type === ComponentType.paragraph) {
    inParagraph(event, component as Paragraph, start, end);
  }
  if (component.type === ComponentType.image) {
    inImage(event, component);
  }
};

export default onKeyDown;

const inParagraph = (
  event: KeyboardEvent,
  component: Paragraph,
  start: number,
  end: number = start
) => {
  let key = event.key;
  // 字符输入
  if (key.length === 1 && !event.ctrlKey && !event.altKey) {
    event.preventDefault();
    if (key === " ") {
      component.addChildren(new Character(key), start, "onkeydown");
      return;
    }
    let decorateList = [];
    if (start === 0) {
      decorateList.push(component.decorateList.get(0));
    } else {
      decorateList.push(component.decorateList.get(start - 1));
    }
    component.addChildren(
      new Character(key),
      start,
      "onkeydown",
      decorateList as CharacterDecorate[]
    );
    return;
  }
  // 触发删除
  if (key === "Backspace") {
    // 若为光标，则删除内容为往前一格
    // 若为选区，则不处理
    if (start === end) {
      start = start - 1;
    }
    // 移除选区内容
    component.removeChildren(start, end - start, "onkeydown");
    return;
  }
  // 触发换行
  if (key === "Enter") {
    // 将段落进行分段
    component.subParagraph(start, end, "onkeydown");
    // 阻止默认行为
    event.preventDefault();
    return;
  }
};

const inImage = (event: KeyboardEvent, component: Collection<any>) => {
  let key = event.key;
  if (key === "Backspace") {
    component.removeSelf();
    let dom = document.getElementById(component.id);
    dom?.remove();
    return;
  }
};