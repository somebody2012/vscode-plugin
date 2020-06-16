
let path = require("path")
let fs = require("fs")

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
let {exec} = require("child_process");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('helloworld.helloWorld', async(data) => {
		
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
		EOF`
		exec(
			sh,
			{encoding:"utf-8",stdio:[process.stdin,process.stdout,process.stderr]},
			function(err:any,stdo:string,stde:string){
			debugger
		})
	});

	context.subscriptions.push(disposable);


	function provideHover(document:any, position:any, token:any) {
    const fileName    = document.fileName;
    const workDir     = path.dirname(fileName);
    const word        = document.getText(document.getWordRangeAtPosition(position));

    console.log('进入provideHover方法');
		const json = document.getText();
		if(/custom-input/.test(word)){
			return new vscode.Hover(`* **名称**：- 1\n* **版本**：${1}\n* **许可协议**：${2}`);
		}
}
	context.subscriptions.push(vscode.languages.registerHoverProvider('vue', {
		provideHover
	}));


	
}

// this method is called when your extension is deactivated
export function deactivate() {}
