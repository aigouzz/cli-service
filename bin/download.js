const { startLoading,endLoading } = require("./loading");
const { config } = require("./repo");
const fse = require("fs-extra");
const path = require('path');
const exec = require('child_process').exec;

let count = 0; //计算下载次数

exports.download = (template_name,project_dir) => {

    return new Promise(async (resolve,reject) => {

        const { url } = config[template_name]; // 模板的下载地址
        const origin_dir = path.join(__dirname, url);

         // 如果目录非空删除目录内容。如果目录不存在,就创建一个
        await fse.emptyDir(project_dir);

        (function execuate(){
            count++;
            if(count >= 5){
                count = 0;
                reject();
                return;
            }
            startLoading(); //加载中
            let executor = exec(`cp -r ${origin_dir} ${project_dir}`, async (err, stdout, stderr) => {
                endLoading();
                if(err) {
                    console.log(err);
                    //出现下载错误,延时3秒重新下载3次
                    console.log("\n下载失败,3s后下载重试...\n");
                    await sleep();
                    execuate(); 
                }else{
                    resolve(null);
                    count = 0;
                    console.log('创建成功，请到您的文件夹中开始工作吧～～');
                }
            });
        })();

    });
};

/**
 * 睡眠
 */
const sleep = (time = 3000) => {
    return new Promise((resolve)=>{
          setTimeout(()=>{
            resolve(null);
          },time)      
    })
}
