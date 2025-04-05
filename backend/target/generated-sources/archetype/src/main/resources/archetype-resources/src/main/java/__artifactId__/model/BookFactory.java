#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package}.${artifactId}.model;

public interface BookFactory {
    Book createBook(String title, String author, Integer year, String genre);
    Book createBook();
} 