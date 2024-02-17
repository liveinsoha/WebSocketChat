package soha.webSocket;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import org.springframework.web.util.HtmlUtils;

@Controller
public class GreetingController {
    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public Greeting greeting(HelloMessage message) throws Exception {
        System.out.println("message = " + message);
        Thread.sleep(1000); // simulated delay
        return new Greeting("Hello, " + HtmlUtils.htmlEscape(message.getName()) + "!");
    }

//    @MessageMapping("/topic/user/{username}")
//    @SendTo("/topic/user/{username}")
//    public Message sendToUser(@DestinationVariable String username, @Payload Message message){
//        System.out.println("message = " + message);
//        Message msg = new Message(message.getId(), message.getMessage());
//        return msg;
//    }
}