import { codes } from "../consts";
import ServiceRepository from "../repository/service";

export default new class ServiceDelivery {
    async status(request, reply) {
        const callback = (service) => reply.code(codes.OK).send(service);
        ServiceRepository.status(callback);
    }

    async clear(request, reply) {
        const callback = () => reply.code(codes.OK).send(null);
        ServiceRepository.clear(callback);
    }
}