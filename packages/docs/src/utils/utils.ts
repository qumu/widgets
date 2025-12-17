export function indentCode(str: string, indentLevel = 2, indentFirstLine?: false): string {
  return str
    .split('\n')
    .map((line, index) => {
      if (!indentFirstLine && index === 0) {
        return line;
      }

      return ' '.repeat(indentLevel) + line;
    })
    .join('\n');
}
