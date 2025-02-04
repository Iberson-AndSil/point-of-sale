const Configuration = ( ()=>{
    const host = window.location.hostname;

    const dev = {
        API : `http://${host}:8080/api`
    }

    const prod={
        //API_AUTH:"https://tickets3.2cdevelopers.com/api/auth",
        //API:"https://tickets3.2cdevelopers.com/api",
        API : `http://192.168.1.45:8080/simba/api`
    }

    const configMap=new Map()
    configMap.set("dev",dev)
    configMap.set("prod",prod)

    const getEnv=()=>{
        const env =/(localhost|127.0.0.1)/.test(host) ?'dev':'prod'
        return env;
    }

    const getConfiguration=()=>{
        const env = getEnv()

        const config = configMap.get(env)
        return config
    }
    return {getConfiguration}
}) (  )

export default Configuration