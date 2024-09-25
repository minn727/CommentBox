import { DefaultDeserializer } from 'v8';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
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
    } else if (fileExtension === 'sh') {
      commentSymbol = '#';
    } else if (fileExtension === 'lua') {
      commentSymbol = '-';
    }

    // 사용자로부터 주석 내용과 줄 길이 입력 받기
    const comment = await vscode.window.showInputBox({ prompt: 'Enter Comment' });
    if (!comment) return;

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
      } else {
        editBuilder.insert(position, `${borderLine}\n${commentLine}\n${borderLine}\n`);
      }
    });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
