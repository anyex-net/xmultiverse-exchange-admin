import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import '../assets/font/SourceHanSansCN-Normal-normal'
// title:下载文件的名称  htmlId:包裹的标签的id name 标题 date 日期
const htmlToPdf = (title: string, htmlId: string,name:string,date:any) => {
    var element = document.querySelector(htmlId) as HTMLElement
    // window.pageYOffset = 0
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    setTimeout(() => {
        html2canvas(element, {
            // allowTaint: true,
            useCORS: true,
            scale: 2, // 提升画面质量，但是会增加文件大小
            // dpi:300,
            height: element.scrollHeight, // 需要注意，element的 高度 宽度一定要在这里定义一下，不然会存在只下载了当前你能看到的页面   避雷避雷！！！
            windowHeight: element.scrollHeight,

        }).then(function (canvas) {
            var contentWidth = canvas.width
            var contentHeight = canvas.height
            // 一页pdf显示html页面生成的canvas高度;
            var pageHeight = (contentWidth * 841.89) / 592.28
            // 未生成pdf的html页面高度
            var leftHeight = contentHeight
            // 页面偏移
            var position = 0
            // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高  //40是左右页边距
            var imgWidth = 595.28 - 40
            var imgHeight = (592.28 / contentWidth) * contentHeight

            var pageData = canvas.toDataURL('image/jpeg', 1.0)

            var pdf = new jsPDF('p', 'pt', 'a4')
            pdf.setFont('SourceHanSansCN-Normal');
            const fontSize = 10;
            // 获取文本的宽度，以计算居中位置
            const textWidth = pdf.getTextWidth(name);
            // 计算居中位置
            const x = (pdf.internal.pageSize.getWidth() - textWidth) / 2;
            const y = (pdf.internal.pageSize.getHeight() - fontSize) / 2;
            // 添加文本到PDF，设置居中
            pdf.text(name, x, 40);
            // 计算右下角的位置
            const x1 = pdf.internal.pageSize.getWidth();
            const y1 = pdf.internal.pageSize.getHeight();
            const coords = {
                x: x1 - pdf.getStringUnitWidth(date) * fontSize,
                y: y1 - fontSize,
            };
            // 在PDF中添加文本
            pdf.setFontSize(fontSize);
            pdf.text(date, coords.x, coords.y, { align: 'right' });

            // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
            // 当内容未超过pdf一页显示的范围，无需分页
            if (leftHeight < pageHeight) {
                // console.log('没超过1页')
                pdf.addImage(pageData, 'JPEG', 20, 70, imgWidth, imgHeight)
            } else {
                while (leftHeight > 0) {
                    // console.log('超过1页')
                    pdf.addImage(pageData, 'JPEG', 20, position, imgWidth, imgHeight)
                    leftHeight -= pageHeight
                    position -= 841.89
                    // 避免添加空白页
                    if (leftHeight > 0) {
                        pdf.addPage()
                    }
                }
            }
            pdf.save(title + '.pdf')
        })
    }, 5)
}

export default htmlToPdf
