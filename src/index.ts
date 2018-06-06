import * as ts from 'typescript';
import * as R from 'ramda';
import * as acorn from 'acorn-jsx';
import * as walk from 'acorn/dist/walk';

import source from '../test/if/source';

transform(source);

function walkCode(code: string, filePath: string) {
    // console.log(code)
    const ast = acorn.parse(code, {
        plugins: { jsx: true },
    });
// console.log(ast)
    // write('ast.json', ast);

//     const state = {
//         ele: null,
//         data: {}, // page data
//         renderData: {}, // render中data
//         root: true,
//         constants: {}, // 全局常量
//         filePath,
//         components: {},
//     };

    walk.simple(ast, {}, walkers, state);
// console.log(Object.keys(walk.base))
    // // write('tree.json', state);

    // transformEleTOComponent(state.ele, state.components, state);

    // state.renderData = parseRenderDataConst(state.renderData);

    // write('tree-after.json', state);

    // return state;
}
function parseClassNode() {
    return R.compose<any, any, any, any, any>(
        R.head,
        R.map(({ name: { escapedText: className }, decorators, members }) => ({
            className,
        })),
        R.filter(R.propEq('kind', ts.SyntaxKind.ClassDeclaration)),
        R.prop('statements'),
    );
}

export function transform(source, format = true, filePath: string = '') {
    const query = { format };
    const sourceFile = ts.createSourceFile(
        'index.tsx',
        source,
        ts.ScriptTarget.ES2016,
        false,
    );
    const tmp = parseClassNode()(sourceFile)
    const jsCode = ts.transpileModule(source, {
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            jsx: ts.JsxEmit.Preserve,
            target: ts.ScriptTarget.ES2016,
        },
    });

    const state = walkCode(jsCode.outputText, filePath);
    // console.log(jsCode.outputText.slice(-1))
    // const page = parseClassNode()(sourceFile);

    // const jsCode = ts.transpileModule(source, {
    //     compilerOptions: {
    //         module: ts.ModuleKind.CommonJS,
    //         jsx: ts.JsxEmit.Preserve,
    //         target: ts.ScriptTarget.ES2016,
    //     },
    // });
    // write('js.js', jsCode.outputText.slice(1, -1));

    // const state = walkCode(jsCode.outputText, filePath);

    // parseRenderData(state);

    // write('tree-parsed.json', state);

    // let wxml = assemblewxml(state.ele, {
    //     data: state.data,
    //     renderData: state.renderData,
    //     constants: state.constants,
    //     componentsList: Object.keys(state.components),
    // });
    // wxml = htmlBeautify(wxml, {
    //     indent_size: query.format ? 2 : 0,
    //     eol: query.format ? '\n' : ' ',
    // });
    // const componentsImports = parseImportLines()(sourceFile);
    // if (componentsImports.length) {
    //     const lines = [];
    //     componentsImports.forEach(e => {
    //         lines.push(source.slice(e.pos, e.end));
    //     });
    //     lines.forEach(e => {
    //         if (e.indexOf('components') > -1) {
    //             source = source.replace(e, `\nimport ${e.split(' ').pop()}`);
    //         }
    //     });
    // }
    // // TODO debug
    // // console.log(wxml);
    // return wxml;
}
