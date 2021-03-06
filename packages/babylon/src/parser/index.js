// @flow

import type { Options } from "../options";
import type { File } from "../types";
import { getOptions } from "../options";
import StatementParser from "./statement";

export const plugins: {
  [name: string]: (superClass: Class<Parser>) => Class<Parser>,
} = {};

export default class Parser extends StatementParser {
  constructor(options: ?Options, input: string) {
    options = getOptions(options);
    super(options, input);

    this.options = options;
    this.inModule = this.options.sourceType === "module";
    this.input = input;
    this.plugins = pluginsMap(this.options.plugins);
    this.filename = options.sourceFilename;

    // If enabled, skip leading hashbang line.
    if (
      this.state.pos === 0 &&
      this.input[0] === "#" &&
      this.input[1] === "!"
    ) {
      this.skipLineComment(2);
    }
  }

  parse(): File {
    const file = this.startNode();
    const program = this.startNode();
    this.nextToken();
    return this.parseTopLevel(file, program);
  }
}

function pluginsMap(
  pluginList: $ReadOnlyArray<string>,
): { [key: string]: boolean } {
  const pluginMap = {};
  for (const name of pluginList) {
    pluginMap[name] = true;
  }
  return pluginMap;
}
