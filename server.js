let http = require('http')    //  node后端服务器网络模块
let fs = require('fs')
let url = require('url')
let port = process.argv[2]

if(!port){
    console.log('请指定端口号访问\n例如 node server.js 8888');
    process.exit(1);
}

let server = http.createServer(function(request, response){    // 创建服务
    let parsedUrl = url.parse(request.url, true);
    let pathWithQuery = request.url;
    let queryString = '';
    if(pathWithQuery.indexOf('?') >= 0){     // 记录查询路径
        queryString = pathWithQuery.substring(pathWithQuery.indexOf('?'))
    };
    let path = parsedUrl.pathname;
    let query = parsedUrl.query;
    let method = request.method;


    console.log('有用户发请求过来啦！路径（带查询参数）为：' + pathWithQuery);

    response.statusCode = 200;     // 请求成功的状态码

    const filePath = path === '/' ? '/index.html' : path;    // 默认首页设置为index.html
    const index = filePath.lastIndexOf('.');
    const suffix = filePath.substring(index);      //  截取访问的文件后缀
    const fileTypes = {      //  支持的文件访问类型
        '.html':'text/html',
        '.css':'text/css',
        '.js':'text/javascript',
        '.png':'image/png',
        '.jpg':'image/jpeg'
    };
    response.setHeader('Content-Type',
        `${fileTypes[suffix] || 'text/html'};charset=utf-8`);   // 读取对应的文件后缀
    let content;       //  读取的本地文件内容
    try{     //  防止访问不存在的文件
        content = fs.readFileSync(`./public${filePath}`);
    }catch(error){
        content = '文件不存在';
        response.statusCode = 404;
    }
    response.write(content);
    response.end();

})

server.listen(port);
console.log('监听 ' + port + ' 成功!\n 请在浏览器中打开 http://localhost:' + port)
