"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
let path = require("path");
let fs = require("fs");
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
let { exec } = require("child_process");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        // Use the console to output diagnostic information (console.log) and errors (console.error)
        // This line of code will only be executed once when your extension is activated
        console.log('Congratulations, your extension "helloworld" is now active!');
        // The command has been defined in the package.json file
        // Now provide the implementation of the command with registerCommand
        // The commandId parameter must match the command field in package.json
        let disposable = vscode.commands.registerCommand('helloworld.helloWorld', (data) => __awaiter(this, void 0, void 0, function* () {
            vscode.window.showInformationMessage('Hello World111 from HelloWorld 11!');
            // let sh = `
            // scp -r -P 22 ~/Desktop/抱持心里基础信息\\(1\\).xlsx root@47.105.154.93:/root/sshTest << EOF
            // 	ls
            // 	echo "拷贝成功"
            // EOF
            // `
            let sh = `ssh root@47.105.154.93 << EOF
			echo "xxxx"
			ls
		EOF`;
            exec(sh, { encoding: "utf-8", stdio: [process.stdin, process.stdout, process.stderr] }, function (err, stdo, stde) {
                debugger;
            });
        }));
        context.subscriptions.push(disposable);
        function provideHover(document, position, token) {
            const fileName = document.fileName;
            const workDir = path.dirname(fileName);
            const word = document.getText(document.getWordRangeAtPosition(position));
            console.log('进入provideHover方法');
            const json = document.getText();
            if (/custom-input/.test(word)) {
                return new vscode.Hover(`* **名称**：- 1\n* **版本**：${1}\n* **许可协议**：${2}`);
            }
        }
        context.subscriptions.push(vscode.languages.registerHoverProvider('vue', {
            provideHover
        }));
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map