import {
    ServicePrincipalCredentials,
    PDFServices,
    MimeType,
    ExtractPDFParams,
    TableStructureType,
    ExtractRenditionsElementType,
    ExtractElementType,
    ExtractPDFJob,
    ExtractPDFResult
} from "@adobe/pdfservices-node-sdk";
import fs from "fs";
import AdmZip from 'adm-zip';
import 'dotenv/config'

(async () => {
    let readStream
    try {
        // Initial setup, create credentials instance
        const credentials = new ServicePrincipalCredentials({
            clientId: process.env.PDF_SERVICES_CLIENT_ID,
            clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET
        })

        // Creates a PDF Services instance
        const pdfServices = new PDFServices({ credentials })

        // Creates an asset(s) from source file(s) and upload
        readStream = fs.createReadStream("example_files/1.pdf")
        const inputAsset = pdfServices.upload({
            readStream: readStream,
            mimeType: MimeType.PDF
        })
        const params = new ExtractPDFParams({
            //tableStructureType: TableStructureType.CSV,
            //elementsToExtractRenditions: [
            //    //ExtractRenditionsElementType.FIGURES,
            //    //ExtractRenditionsElementType.TABLES
            //],
            elementsToExtract: [
                ExtractElementType.TEXT
                //ExtractElementType.TABLES
            ]
        })
        const job = new ExtractPDFJob({ inputAsset, params })
        const pollingURL = await pdfServices.submit({ job })
        const pdfServicesResponse = await pdfServices.getJobResult({
            pollingURL,
            resultType: ExtractPDFResult
        })

        // Get content from the resulting asset(s)
        const resultAsset = pdfServicesResponse.result.resource
        const streamAsset = await pdfServices.getContent({ asset: resultAsset })

        // Creates a write stream and copy stream asset's content to it
        const outputFilePath = "ExtractTextInfoFromPDF.zip"
        console.log(`Saving asset at ${outputFilePath}`)

        const writeStream = fs.createWriteStream(outputFilePath)
        streamAsset.readStream.pipe(writeStream)

        let zip = new AdmZip(outputFilePath)
        let jsondata = zip.readAsText('structuredData.json')
        let data = JSON.parse(jsondata)
        data.elements.forEach(element => {
                console.log(`${element.Text}`)
            
        });
    } catch (err) {
        console.error("Exception encountered while executing operation", err)
    } finally {
        readStream?.destroy()
    }
})()