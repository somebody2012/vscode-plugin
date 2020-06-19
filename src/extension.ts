
let path = require("path")
let util = require("util")
let fs = require("fs")

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const exec = util.promisify(require('child_process').exec);
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let oldDevIp = "10.16.61.50";
let newDevIp = "14.0.33.161";


function findFCClientIndex(nameArr:any){
	let rootName = ["FCClient2","FCClientCommon","FCClient"];
	let index = -1;
	for(let i=0;i<rootName.length;i++){
		let index1 = nameArr.indexOf(rootName[i]);
		if(index1 != -1){
			index = index1;
			break
		}
	}
	return index;
}


function buildTrade(buildCWD:string,buildPath:string){
	return new Promise(resolve => {
		buildPath = buildPath.replace(/\\/g,"/")
		let sh = `npm run build:trade ${buildPath}`
		vscode.window.showInformationMessage(`编译命令：${sh}`)
		let env = process.env
		if(!env.SHEEL_PATH){
			vscode.window.showErrorMessage("环境变量SHEEL_PATH为空，比如：D:\\Program Files\\Git\\bin\\bash.exe")
			resolve(false)
			return;
		}
		let options = {
			encoding:"utf-8",
			stdio:[process.stdin,process.stdout,process.stderr],
			cwd:buildCWD,
			shell:env.SHEEL_PATH
		};
		let res = exec(sh,options,function(err:any,stdo:string,stde:string){
			if(err){
				vscode.window.showErrorMessage(err.message);
				resolve(false);
			}else{
				vscode.window.showInformationMessage(`编译${buildPath}成功`);
				resolve(true);
			}
		})
	});
	
}

function uploadFile(localDirPath:string,filename:string,remotePath:string){
	return new Promise(resolve => {
		
		
		let localFilePath = path.resolve(localDirPath,filename);
		localFilePath = localFilePath.replace(/\\/g,"/");
		// let sh = `scp -r -P 22 ${localFilePath} root@10.16.61.50:${remotePath}`//开发
		// let sh = `sftp -P 22 root@${oldDevIp}:${remotePath}<<EOF\nput ${localFilePath}\nbye\nEOF`//old开发
		let sh = `sftp -P 22 root@${newDevIp}:${remotePath}<<EOF\nput ${localFilePath}\nbye\nEOF`//new开发
		let sh1 = "sftp -P 22 root@10.16.61.50:/aarm/workspace/www/FCClient/modules/trade/auth/t00040404/t00040404_1<<EOF put e:\\work\\zantong\\stage2xxxxxxxxxxxx\\client\\release\\workspace\\FCClient\\modules\\trade\\auth\\t00040404\\t00040404_1\\a.a EOF"
		vscode.window.showInformationMessage(`开始上传IP:${sh}`);
		// let sh = `scp -r -P 22 ${localFilePath} root@47.105.154.93:${remotePath}`//阿里云
		let env = process.env
		if(!env.SHEEL_PATH){
			vscode.window.showErrorMessage("环境变量SHEEL_PATH为空，比如：D:\\Program Files\\Git\\bin\\bash.exe")
			resolve(false)
			return;
		}
		let options = {
			encoding:"utf-8",
			stdio:[process.stdin,process.stdout,process.stderr],
			// shell:"D:\\Program Files\\Git\\bin\\bash.exe"
			shell:env.SHEEL_PATH
		};
		let res = require('child_process').exec(sh,options,function(err:any,stdo:string,stde:string){
			if(err){
				vscode.window.showErrorMessage(err.message + stde)
				resolve(false)
			}else{
				resolve(true)
			}
		});

		// debugger
		// require('child_process').spawn("bash",["sftp","-P",22,"root@10.16.61.50",""],{
		// 	// cwd: this.workspacePath,
    //   stdio: [process.stdin,process.stdout,process.stderr]
		// },function(err:string,stdo:string,stde:string){
		// 	debugger
		// });
		// debugger
	});
	
}


export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('helloworld.helloWorld', async(data) => {
		
		// vscode.window.showInformationMessage('Hello World111 from HelloWorld 11!');
		if(!/FCClient2|FCClientCommon|FCClient/.test(data.fsPath)){
			vscode.window.showErrorMessage("工程不对");
			return;
		}
		let nameArr = data.fsPath.split(path.sep);
		let FCClientIndex = findFCClientIndex(nameArr);
		//"/root/sshTest/modules/trade/zfjs/t00301032"
		let remotePath = "/aarm/workspace/www/FCClient/" + nameArr.slice(FCClientIndex+1,-1).join("/");
		//"e:/work/zantong/client/release/workspace/FCClient2/modules/trade/zfjs/t00301032"
		let localDirPath = nameArr.slice(0,FCClientIndex).join("/") + "/client/release/workspace/" + nameArr.slice(FCClientIndex,-1).join("/");
		localDirPath = localDirPath.replace(/FCClient2|FCClientCommon/,"FCClient");
		//"modules\trade\zfjs\t00301032\App.vue"
		let buildPath = nameArr.slice(FCClientIndex+1).join("\\");
		if(/\.json$/.test(nameArr[nameArr.length-1])){
			fs.copyFileSync(data.fsPath,localDirPath);
			vscode.window.showInformationMessage(`拷贝文件${data.fsPath}->${localDirPath} 成功`)
		}else{
			//build执行命令目录
			let buildCWD = nameArr.slice(0,FCClientIndex+1).join(path.sep);
			vscode.window.showInformationMessage(`开始编译,编译目录：${buildCWD},编译交易路径：${buildPath}`);
			let buildRes = await buildTrade(buildCWD,buildPath);
			if(!buildRes) return;
		}
		
		let uploadFiles = [];
		try{
			uploadFiles = fs.readdirSync(localDirPath);
			let basename = path.basename(data.fsPath);
			uploadFiles = uploadFiles.filter(function(name:string){return name.includes(basename)})
		}catch(e){
			vscode.window.showErrorMessage(e.message);
			return;
		}
		
		let ups = uploadFiles.map(function(filename:string) {
			return uploadFile(localDirPath,filename,remotePath)
		})
		let upsRes = await Promise.all(ups);
		let isUpSuccess = upsRes.every(v => v);
		if(isUpSuccess){
			vscode.window.showInformationMessage("上传成功");
		}

		// if(copyRes.error){
		// 	vscode.window.showInformationMessage(copyRes.message);
		// }else{
		// 	vscode.window.showInformationMessage(`上传文件${path.basename(data.fsPath)}成功`);
		// }

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
