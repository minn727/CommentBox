"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.insertFormattedComment', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const filePath = editor.document.fileName;
        const fileExtension = filePath.split('.').pop();
        let commentSymbol = '*';
        if (fileExtension === 'cc' || fileExtension === 'cpp' || fileExtension === 'h') {
            commentSymbol = '*';
        }
        else if (fileExtension === 'sh') {
            commentSymbol = '#';
        }
        else if (fileExtension === 'lua') {
            commentSymbol = '-';
        }
        // 사용자로부터 주석 내용과 줄 길이 입력 받기
        const comment = await vscode.window.showInputBox({ prompt: 'Enter Comment' });
        if (!comment)
            return;
        const lengthInput = await vscode.window.showInputBox({ prompt: 'Enter Line Length', value: '40' });
        const lineLength = parseInt(lengthInput || '40', 10);
        if (isNaN(lineLength) || lineLength < comment.length + 6) {
            vscode.window.showErrorMessage('Line length should be a number and longer than the comment with padding.');
            return;
        }
        // 주석의 패딩 계산
        const padding = Math.floor((lineLength - comment.length - 4) / 2);
        const borderLine = (fileExtension === 'cc' || fileExtension === 'cpp' || fileExtension === 'h') ? commentSymbol.repeat(lineLength - 1) : commentSymbol.repeat(lineLength);
        const commentLine = `${commentSymbol}${commentSymbol}${' '.repeat(padding)}${comment}${' '.repeat(lineLength - padding - comment.length - 4)}${commentSymbol}${commentSymbol}`;
        // 주석 삽입
        editor.edit(editBuilder => {
            const position = editor.selection.active;
            if (fileExtension === 'cc' || fileExtension === 'cpp' || fileExtension === 'h') {
                editBuilder.insert(position, `${'/'}${borderLine}\n${commentLine}\n${borderLine}${'/'}\n`);
            }
            else {
                editBuilder.insert(position, `${borderLine}\n${commentLine}\n${borderLine}\n`);
            }
        });
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map