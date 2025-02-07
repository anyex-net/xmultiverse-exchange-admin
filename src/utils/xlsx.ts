import XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import { ElMessage } from "element-plus";
export const downLoan = (data: any,time:any, wpx?: number, sz?: number, rgb?: string) => {
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    // 创建工作簿并添加工作表
    const workbook = XLSX.utils.book_new();
    let alphabet = [];
    //判断一行显示多少个字段,生成26个字母,根据26个字母设置样式
    for (let i = 1; i <= data[0].length; i++) {
        alphabet.push(String.fromCharCode(64 + i).toUpperCase());
    }
    //给第一行设置标题样式
    for (let i = 0; i < alphabet.length; i++) {
        worksheet[alphabet[i] + 1].s = {
            font: {
                bold: true, color: { rgb: "000000" },
                sz: 16,
                name: "Arial",
            },
            alignment: { horizontal: "center", vertical: "center" },
        };
    }
    // 给第二行设置标题样式
    for (let i = 0; i < alphabet.length; i++) {
        worksheet[alphabet[i] + 2].s = {
            font: {
                bold: true, color: { rgb: "FFFFFF" },
                sz: sz,
                name: "Arial",
            },
            alignment: { horizontal: "center" },
            fill: { fgColor: { rgb: rgb } },
        };
    }
    // 给所有内容设置样式
    for (let i = 0; i < alphabet.length; i++) {
        for (let j = 3; j <= data.length; j++) {
            worksheet[alphabet[i] + j].s = {
                font: {
                    sz: sz,
                    name: "Arial",
                },
                alignment: { horizontal: "center" },

            };
        }
    }
    //给第一行单元格设置高度
    worksheet["!rows"] = [
        {
            hpx: 30,
        },
    ];

    // 设置宽度
    worksheet["!cols"] = [];
    for (let i = 0; i < alphabet.length; i++) {
        worksheet["!cols"].push({ wpx: wpx });
    }
    //合并单元格 第一行
    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: alphabet.length - 1 } }];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // 设置冻结窗格 (前两行)
    // 设置固定前两行
    const ws_data = worksheet['A1'];
    ws_data.s = {
        ...ws_data.s,
        windowProtect: true,
        topLeftCell: 'A2',
        // 冻结前两行
        pane: {
            xSplit: '1', // 冻结第一列
            ySplit: '2', // 冻结到第二行
            topLeftCell: 'B2',
            activePane: 'bottomRight',
            state: 'frozen',
        },
    };
    // worksheet.views = [{ state: 'frozen', xSplit: 1, ySplit: 2 }];
    // 生成Excel文件并导出
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
    saveAs(dataBlob, time+".xlsx");

};
//导出函数
export const downloadFile = (data: any, time:any) => {
    if (!data) {
        ElMessage({
            message: '操作失败',
            type: "error",
        });
    }
    let url = window.URL.createObjectURL(new Blob([data]));
    let links = document.createElement("a");
    links.style.display = "none";
    links.href = url;
    links.setAttribute("download", time+ ".xlsx");
    document.body.appendChild(links);
    links.click();
    ElMessage({
        message: '操作成功',
        type: "success",
    });
};

