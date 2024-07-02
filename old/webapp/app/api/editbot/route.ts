export async function POST(request: Request) {
    const res = await request.formData()
    console.log();
    let newBotSettings = {
        name: res.get("name"),
        site: res.get("site"),
        description: res.get("botdesc"),
        datasource: {
            hostedFiles: res.getAll("botupload").map((file) => { return { src: "bucket.com/myfile.pdf", fileName: file.name, size: file.size } })
        }
    }
    console.log(JSON.stringify(newBotSettings))
    return Response.json(newBotSettings)
}