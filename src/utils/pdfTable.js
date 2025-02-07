import jsPDF from 'jspdf'
import 'jspdf-autotable';
import '../assets/font/SourceHanSansCN-Normal-normal'
//list 列表数据 columns 表头数据 data下载文件名 title 标题
export async function downPDF(list,columns,data,title) {
// // 设置字体
let dataList=list;
    const doc = new jsPDF();
    doc.setFont('SourceHanSansCN-Normal');
    // 设置字体大小，这里设置为16
    const fontSize = 16;
    // 获取文本的宽度，以计算居中位置
    const textWidth = doc.getTextWidth(title);
    // 计算居中位置
    const x = (doc.internal.pageSize.getWidth() - textWidth) / 2;
    const y = (doc.internal.pageSize.getHeight() - fontSize) / 2;
    // 添加文本到PDF，设置居中
    doc.text(title, x, 10);
    // 设置表格样式的回调函数
    const getStyles = (row, rowIndex) => {
        const styles = {};
        // 条纹表头的行索引是偶数
        if (rowIndex === 0 && rowIndex % 2 === 0) {
            styles.fillColor = [0, 1, 88]; // 设置背景色为灰色
        }
        return styles;
    };
    doc.autoTable(columns,list,{
        headStyles: { fillColor: [238, 238, 238],textColor: [81 ,90, 110] }, // 设置表头背景颜色
        bodyStyles: { textColor: [81 ,90, 110] }, // 设置表格内容文字颜色
        alternateRowStyles: { fillColor: [255, 255, 255] }, // 设置交替行背景颜色
        horizontalPageBreak:true,//如果表格宽度超过页面宽度，则将表格拆分为多个页面
        horizontalPageBreakBehaviour:'afterAllRows',
        startY: 20,
        margin:10,
        // showHeader: 'firstPage',//仅第一页显示表头
        theme:'striped',
        tableWidth: '100',//表格宽度设置
        styles: {
            // minCellHeight:10,
            font:'SourceHanSansCN-Normal',
            columnWidth:'wrap',
            fontSize: 10, // 设置字体大小
        },
        columnStyles:{
            2:{cellWidth:'wrap',cellHeight:'wrap'}
        }

    });
    let first=doc.autoTable.previous;
//
//     // 保存生成的PDF
    doc.save(data+'.pdf');
}
