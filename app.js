var fs=require('fs-extra');
var express=require('express')
var bodyparser=require('body-parser')
var readline=require("readline")
var app=express();
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs")
//console.log(fs)
var input=process.stdin;
var logs=[]


//console.log("is"+ddata)

var path="root";
var dirs=[]

function touch(name,ext){
	
	var fpath=path+"/"+name+"."+ext;
	fs.outputFile(fpath,"",function(err){
		if(err){
			output=err
		}
		else{
			output="done"
		}
	})	
	
	
	

}
//touch("test2","txt");

function mkdir(name){
	fpath=path+"/"+name
	fs.mkdir(fpath,function(err){
		if(err){
			output=err;
		}
		else{
			output="done"
		}
	})

}

function dir(){
	
fs.readdir(path, function(err, items) {
	
    dirs=items
    output=dirs

})

}
//mkdir("new1")
//dir();
function cd(loc){
	var floc=path+"/"+loc
	if(loc==".."){
		if(path=="root"){
			output="this is root dir"
		}
		else{
			var a=path.lastIndexOf("/")
			path=path.slice(0,a)
			output="current path is: "+path

		}
	}
else if(fs.existsSync(floc)){
	
	path=floc
	output="current path is: "+path
}
else{
	output="location does not exist"
}
}
cd("dir 9")

function del(name){
fpath=path+"/"+name;
fs.remove(fpath,function(err){
	
	if(err){
		output=err
	}
	else{
		output="done"
	}
})
}
//del("new1")
function copy(src,des){
	src=path+"/"+src;
	des=path+"/"+des;

fs.copy(src,des,function(err){
	if(err){
		output=err;
	}
	else{
		output="done"
	}
})
}


function move(src,des){
src=path+"/"+src;
	des=path+"/"+des;

fs.move(src,des,function(err){
	if(err){
		output=err;
	}
	else{
		output="done"
	}
})
}
function read(name){
	name=path+"/"+name;
try{
output = fs.readFileSync(name,'utf8')
}
catch(err){
	output=err
}


}

function write(name,data){
	name=path+"/"+name
	fs.appendFile(name,data,function(err){
		if(err){
			output=err;
		}
		else{
			output="done";
		}
	})

}
function rename(name,newname){
	name=path+"/"+name;
	newname=path+"/"+newname;
fs.rename(name,newname,function(err){
	if(err){
		output=err
	}
	else{
		output="done"
	}
})
}

var output="null"

//////////////////////////
app.post("/",function(req,res){
	console.log("command(IN):"+" "+req.body.command+"\nOutput: "+output)
	
	var input=req.body.command
	
	if(input.indexOf("dir")==0){
		output=dir();
		res.redirect("/")
	}
	else if(input.indexOf("del")==0){
		var name=input.slice(4)
		del(name);
		res.redirect("/")

	}
	else if(input.indexOf("mkdir")==0){
		var name=input.slice(6)
		mkdir(name);
		res.redirect("/")

	}
	else if(input.indexOf("copy")==0){
		var name=input.slice(5)
		var br=name.indexOf("+");
		var src=name.slice(0,br)
		var des=name.slice(br+1)
		copy(src,des);
		res.redirect("/")
	
	}
	else if(input.indexOf("move")==0){
		var name=input.slice(5)
		var br=name.indexOf("+");
		var src=name.slice(0,br)
		var des=name.slice(br+1)
		move(src,des);
		res.redirect("/")
	
	}
	else if(input.indexOf("touch")==0){
		var name=input.slice(6)
		var br=name.indexOf(".")
		if(br!=-1&&br!=name.length-1){
		var nm=name.slice(0,br)
		var ext=name.slice(br+1)
		touch(nm,ext);
		}
		else{
			output="error:extention not provided"
		}
		
		res.redirect("/")
	}
	else if(input.indexOf("read")==0){
		var name=input.slice(5)
		read(name);
		res.redirect("/")
		
	}
	else if(input.indexOf("rename")==0){
		var name=input.slice(7)
		var br=name.indexOf("+")
		if(br!=-1&&br!=name.length-1){
		
		var newname=name.slice(br+1)
		var name=name.slice(0,br)
		rename(name,newname);
		}
		else{
			output="invalid syntax"
		}
		read(name);
		res.redirect("/")
		
	}
	else if(input.indexOf("write")==0){
		var name=input.slice(6)
		var br=name.indexOf("+")
		if(br!=-1&&br!=name.length-1){
		
		var data=name.slice(br+1)
		var name=name.slice(0,br)
		write(name,data);
		}
		else{
			output="invalid syntax"
		}
		read(name);
		res.redirect("/")
		
	}
	else if(input.indexOf("cd")==0){
		var name=input.slice(3)
		if(name.length!=0){
			cd(name);
		}
		else{
			output="invalid dir"
		}
		
		res.redirect("/")

	}
	else{
		output="invalid command"
		res.redirect("/")
	}
});
app.get("/",function(req,res){
	//logs.push(String(output));
	//console.log(logs)
	dir();
	res.render("gui",{dirs:dirs,logs:logs,output:output})

})
/////////////////////////
app.listen("80",function(){
	console.log("80 is up")
})
