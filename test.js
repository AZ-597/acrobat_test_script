var mm2pt = function(mm) {
	return mm/25.4*72;
};

var pt2mm = function(pt) {
	return pt/72*25.4;
};

var сopyPage = function(nPageNum, nTimes) {
	// create template from page
	var t = this.createTemplate({cName:"myTemplate", nPage: nPageNum });
	// hide template
	t.hidden = true;
	// spawn nTimes pages from template
	var t = this.templates;
	var T = t[0];
	// get first templage
	for (var i =0; i < nTimes; i++)  {
		T.spawn({
			nPage: this.numPages,
			bRename: false,
			bOverlay: false }
		);
	}
	// remove the template
	this.removeTemplate({cName: 'myTemplate'});
	return;
}

/* ---------------------------------------------------------------------------------- */

var testFunc = app.trustedFunction(function() {
	app.beginPriv();
	console.show();
	console.println('Hello!');

	сopyPage(1, 2); //Дублируем внутренний разворот обложки для дальнейшего кропа

	var myBlock = app.browseForDoc();
	this.insertPages({
		cPath: myBlock.cPath,
		nPage: 1
	}); //Выбираем и вставляем блок

	var bookPageCount = this.numPages; // Получаем количество страниц в документе

	var blockSizesRect = this.getPageBox({
		cBox: "Media",
		nPage: 2
	}); // Получаем размер блока

	var coverSizesRect = this.getPageBox({
		cBox: "Media",
		nPage: bookPageCount-1
	}); // Получаем размер обложки

	this.setPageBoxes({
		cBox: "Media",
		nStart: 1,
		nEnd: 1,
		rBox: [mm2pt(0), mm2pt(0), (blockSizesRect[2]-mm2pt(6)), blockSizesRect[1]]
	}); // Обрезаем зону склейки на второй полосе обложки

	this.setPageBoxes({
		cBox: "Media",
		nStart: 2,
		nEnd: 2,
		rBox: [mm2pt(6), mm2pt(0), coverSizesRect[2], blockSizesRect[1]]
	}); // Обрезаем зону склейки на первой полосе блока

	this.setPageBoxes({
		cBox: "Media",
		nStart: bookPageCount-2,
		nEnd: bookPageCount-2,
		rBox: [mm2pt(0), mm2pt(0), (blockSizesRect[2]-mm2pt(6)), blockSizesRect[1]]
	}); // Обрезаем зону склейки на последней полосе блока

	this.setPageBoxes({
		cBox: "Media",
		nStart: bookPageCount-1,
		nEnd: bookPageCount-1,
		rBox: [(coverSizesRect[2]-blockSizesRect[2]+mm2pt(6)), mm2pt(0), coverSizesRect[2], blockSizesRect[1]]
	}); // Обрезаем зону склейки на предпоследней полосе обложки



	//var myNewDoc = app.newDoc({nWidth: mm2pt(148.5), nHeight: mm2pt(210)});
	//var myFile = app.browseForDoc();
	//myNewDoc.insertPages({cPath: myFile.cPath});

	/* myNewDoc.setPageBoxes({
		cBox: "Media",
		nStart: 0,
		nEnd: 0,
		rBox: [mm2pt(0), mm2pt(0), mm2pt(103), mm2pt(206)]
	}); */

	//var myFile = app.browseForDoc();
	//console.println(myFile);
	/* myNewDoc.insertPages ({
		nPage: -1,
		cPath: app.browseForDoc(),
		nStart: 0
	}); */


	/* myNewDoc.insertPages({
		nPage: -1,
		cPath: "",
		nStart:0
	}); */

	app.endPriv();
});

app.addMenuItem({
	cName: "testScript",
	cUser: "Test script",
	cParent: "File",
	cExec: "testFunc()",
	nPos: 0
});
