function status(request, response) {
  response.status(200).json({ "chave": "'É, está certo" })
}

export default status
