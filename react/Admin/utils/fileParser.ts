import XLSX from 'xlsx'

export function parseXLSToJSON(file: Blob): Promise<unknown[]> {
  const promise = new Promise<unknown[]>((resolve, reject) => {
    const fileReader = new FileReader()

    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      const data = e.target?.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const [sheetName] = workbook.SheetNames
      const json = XLSX.utils.sheet_to_json<unknown>(workbook.Sheets[sheetName])

      resolve(json)
    }

    fileReader.onerror = () => {
      reject('Error parsing file')
    }

    fileReader.readAsBinaryString(file)
  })

  return promise
}
